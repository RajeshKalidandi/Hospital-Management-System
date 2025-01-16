const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',  // Allow all origins for now to debug
  credentials: true
}));

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Admin login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;

    // Hardcoded admin credentials for immediate access
    const ADMIN_EMAIL = 'admin@healthcareclinic.com';
    const ADMIN_PASSWORD = 'admin@2025';

    console.log('Comparing credentials...');
    console.log('Received email:', email);
    console.log('Expected email:', ADMIN_EMAIL);
    console.log('Passwords match:', password === ADMIN_PASSWORD);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log('Credentials matched, generating token...');
      
      const token = jwt.sign(
        { id: 'admin-1', email, isAdmin: true },
        process.env.JWT_SECRET || 'fallback-secret-key-for-development',
        { expiresIn: '24h' }
      );

      console.log('Token generated successfully');
      
      return res.json({
        success: true,
        token,
        admin: { id: 'admin-1', email }
      });
    }

    console.log('Invalid credentials provided');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Export the serverless function
exports.handler = serverless(app); 