const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check token expiration with some buffer time (5 minutes)
      const bufferTime = 5 * 60; // 5 minutes in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decoded.exp - currentTime < bufferTime) {
        return res.status(401).json({ 
          message: 'Token is about to expire',
          code: 'TOKEN_EXPIRING'
        });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      }

      throw jwtError;
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.isAdmin) {
        return res.status(403).json({ 
          message: 'Admin access required',
          code: 'ADMIN_REQUIRED'
        });
      }

      // Check token expiration with some buffer time (5 minutes)
      const bufferTime = 5 * 60; // 5 minutes in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decoded.exp - currentTime < bufferTime) {
        return res.status(401).json({ 
          message: 'Token is about to expire',
          code: 'TOKEN_EXPIRING'
        });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      }

      throw jwtError;
    }
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
