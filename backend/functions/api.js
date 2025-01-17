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
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  next();
});

app.use(express.json());

// Routes without .netlify prefix (handled by redirects)
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/patients', patientRoutes);
app.use('/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method
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

  try {
    const result = await handler(event, context);
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
}; 