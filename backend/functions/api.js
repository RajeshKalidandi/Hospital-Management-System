const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../src/routes/authRoutes');
const appointmentRoutes = require('../src/routes/appointmentRoutes');
const patientRoutes = require('../src/routes/patientRoutes');
const paymentRoutes = require('../src/routes/paymentRoutes');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://healthcareclinic-management.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers,
    origin: req.get('origin')
  });
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/patients', patientRoutes);
app.use('/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    headers: req.headers,
    method: req.method,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', new Date().toISOString(), err.stack);
  res.status(err.status || 500).json({ 
    error: err.name || 'Internal Server Error',
    message: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// Create serverless handler
const handler = serverless(app);

// Common headers for all responses
const commonHeaders = {
  'Access-Control-Allow-Origin': 'https://healthcareclinic-management.netlify.app',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Export the handler function
exports.handler = async (event, context) => {
  // Log the incoming request
  console.log('[REQUEST]', new Date().toISOString(), {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    body: event.body
  });

  // Clean up the path
  let cleanPath = event.path;
  
  // Remove both potential prefixes
  const prefixes = ['/.netlify/functions/api', '/api'];
  for (const prefix of prefixes) {
    if (cleanPath.startsWith(prefix)) {
      cleanPath = cleanPath.substring(prefix.length);
      break;
    }
  }

  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // Update the event path
  event.path = cleanPath;

  console.log('[PATH]', new Date().toISOString(), 'Processed path:', event.path);

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: commonHeaders
    };
  }

  try {
    const result = await handler(event, context);
    
    // Ensure CORS headers are present in the response
    const headers = {
      ...commonHeaders,
      ...result.headers
    };

    console.log('[RESPONSE]', new Date().toISOString(), {
      statusCode: result.statusCode,
      headers: headers
    });

    return {
      ...result,
      headers: headers
    };
  } catch (error) {
    console.error('[ERROR]', new Date().toISOString(), error);
    return {
      statusCode: 500,
      headers: commonHeaders,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        path: event.path,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 