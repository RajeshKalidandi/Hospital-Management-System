const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://healthcareclinic-management.netlify.app', 'http://localhost:5173'],
  credentials: true
}));

// Admin login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if it's the default admin
    if (email === 'admin@healthcareclinic.com') {
      const isValidPassword = password === 'admin@2025';
      
      if (isValidPassword) {
        const token = jwt.sign(
          { id: 'default-admin', email, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.json({ 
          token,
          admin: { id: 'default-admin', email }
        });
      }
    }

    // If not default admin, check in Supabase
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export the serverless function
exports.handler = serverless(app); 