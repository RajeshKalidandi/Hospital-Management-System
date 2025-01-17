const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let supabase;

try {
  const { supabase: supabaseClient } = require('../config/supabaseClient');
  supabase = supabaseClient;
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Continue without Supabase - will use fallback authentication
}

// Admin login endpoint
router.post('/login', async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log('Admin login attempt:', {
    timestamp,
    email: req.body.email,
    // Don't log the password for security
    headers: req.headers
  });

  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Missing credentials:', { timestamp, email });
      return res.status(400).json({
        error: 'Email and password are required',
        timestamp
      });
    }

    // Try Supabase auth if available
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authData?.user) {
          console.log('Supabase auth successful:', {
            timestamp,
            userId: authData.user.id
          });

          // Check if user is an admin in our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('role', 'admin')
            .single();

          if (userError || !userData) {
            console.log('User not found or not admin:', {
              timestamp,
              error: userError?.message
            });
            return res.status(403).json({
              error: 'Not authorized as admin',
              timestamp
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            {
              userId: userData.id,
              email: userData.email,
              role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          console.log('Admin login successful:', {
            timestamp,
            userId: userData.id
          });

          return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name
            },
            timestamp
          });
        }

        if (authError) {
          console.log('Supabase auth failed:', {
            timestamp,
            error: authError.message
          });
        }
      } catch (supabaseError) {
        console.error('Supabase auth error:', {
          timestamp,
          error: supabaseError.message
        });
      }
    }

    // Fallback authentication using local database
    // This is a placeholder - replace with your actual database logic
    const adminUser = {
      id: '1',
      email: 'admin@example.com',
      password: '$2b$10$YourHashedPasswordHere', // Replace with actual hashed password
      role: 'admin',
      name: 'Admin User'
    };

    if (email !== adminUser.email) {
      console.log('Admin user not found:', { timestamp });
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp
      });
    }

    // For development/testing, allow a specific password
    const validPassword = process.env.NODE_ENV === 'development' && password === 'admin123' ? 
      true : 
      await bcrypt.compare(password, adminUser.password);

    if (!validPassword) {
      console.log('Invalid password:', { timestamp });
      return res.status(401).json({
        error: 'Invalid credentials',
        timestamp
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Admin login successful (fallback):', {
      timestamp,
      userId: adminUser.id
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      },
      timestamp
    });

  } catch (error) {
    console.error('Login error:', {
      timestamp,
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'An error occurred during login',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  const timestamp = new Date().toISOString();
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'No token provided',
      timestamp
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    let user;
    
    if (supabase) {
      // Try Supabase first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .eq('role', 'admin')
        .single();

      if (!error && data) {
        user = data;
      }
    }

    // Fallback to local verification
    if (!user) {
      // This is a placeholder - replace with your actual database logic
      if (decoded.email === 'admin@example.com') {
        user = {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          name: 'Admin User'
        };
      }
    }

    if (!user) {
      console.log('Token verification failed - user not found:', {
        timestamp,
        userId: decoded.userId
      });
      return res.status(401).json({
        error: 'Invalid token',
        timestamp
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      timestamp
    });
  } catch (error) {
    console.error('Token verification error:', {
      timestamp,
      error: error.message
    });
    res.status(401).json({
      error: 'Invalid token',
      timestamp
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log('Logout request:', { timestamp });
  
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token
  res.json({
    message: 'Logged out successfully',
    timestamp
  });
});

module.exports = router;
