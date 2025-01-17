const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Log the current directory and files for debugging
console.log('Current directory:', __dirname);
console.log('Files in directory:', require('fs').readdirSync(__dirname));

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
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });
  next();
});

// Basic routes
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/patients', patientRoutes);
app.use('/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    environment: process.env.NODE_ENV,
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
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: process.env.NETLIFY
    },
    dirname: __dirname,
    files: require('fs').readdirSync(__dirname)
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    path: req.path
  });
});

// Handle 404s
app.use((req, res) => {
  console.log('404 Not Found:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    headers: req.headers
  });
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    path: req.path
  });
});

// Serverless handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // Log incoming request
  console.log('Incoming request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    body: event.body
  });

  // Strip /.netlify/functions/api prefix if present
  if (event.path.startsWith('/.netlify/functions/api')) {
    event.path = event.path.replace('/.netlify/functions/api', '');
  }
  
  // Ensure path starts with /
  if (!event.path.startsWith('/')) {
    event.path = '/' + event.path;
  }

  console.log('Processed path:', event.path);

  try {
    const result = await handler(event, context);
    console.log('Response:', {
      statusCode: result.statusCode,
      body: result.body
    });
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        path: event.path
      })
    };
  }
}; 