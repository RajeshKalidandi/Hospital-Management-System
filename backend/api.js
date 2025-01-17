const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://healthcareclinic-management.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    originalUrl: req.originalUrl
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Auth routes logging middleware
app.use('/auth', (req, res, next) => {
  console.log('Auth route accessed:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/patients', patientRoutes);
app.use('/payments', paymentRoutes);

// Test auth endpoint
app.post('/test-auth', (req, res) => {
  console.log('Test auth endpoint hit:', {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
  res.json({ 
    message: 'Test auth endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Debug middleware to log route matching
app.use((req, res, next) => {
  console.log('Route matching debug:', {
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  next();
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log('404 - Route not found:', {
    method: req.method,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    path: req.path,
    body: req.body,
    headers: req.headers,
    timestamp
  });
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    timestamp
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method,
    timestamp
  });
});

// Serverless handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // Log incoming request
  const timestamp = new Date().toISOString();
  console.log('Incoming request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    body: event.body,
    timestamp
  });

  // Handle path normalization
  let normalizedPath = event.path;
  
  // Strip /.netlify/functions/api prefix if present
  if (normalizedPath.startsWith('/.netlify/functions/api')) {
    const originalPath = normalizedPath;
    normalizedPath = normalizedPath.replace('/.netlify/functions/api', '');
    console.log('Path transformation:', {
      originalPath,
      normalizedPath,
      timestamp
    });
  }

  // Ensure path starts with /
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }

  // Update event path
  event.path = normalizedPath;

  try {
    // Parse body if it's a string
    if (typeof event.body === 'string' && event.body) {
      try {
        event.body = JSON.parse(event.body);
        console.log('Parsed request body:', {
          body: event.body,
          timestamp
        });
      } catch (e) {
        console.error('Body parsing error:', e);
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'Invalid JSON in request body',
            message: e.message,
            timestamp
          })
        };
      }
    }

    const result = await handler(event, context);
    console.log('Response:', {
      statusCode: result.statusCode,
      body: result.body,
      timestamp
    });
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp
      })
    };
  }
}; 