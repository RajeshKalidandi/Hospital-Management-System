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

app.use(cors({
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
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
    timestamp: new Date().toISOString()
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
    env: process.env.NODE_ENV
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    path: req.path
  });
});

// Create serverless handler
const handler = serverless(app);

// Export the handler function
exports.handler = async (event, context) => {
  // Log the incoming request
  console.log('Incoming request:', {
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

  console.log('Processed path:', event.path);

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://healthcareclinic-management.netlify.app',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      }
    };
  }

  try {
    const result = await handler(event, context);
    
    // Ensure CORS headers are present in the response
    const headers = {
      'Access-Control-Allow-Origin': 'https://healthcareclinic-management.netlify.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
      ...result.headers
    };

    return {
      ...result,
      headers: headers
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://healthcareclinic-management.netlify.app',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        path: event.path
      })
    };
  }
}; 