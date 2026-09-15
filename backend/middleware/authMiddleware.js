import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * ============================================================================
 * FUNCTION SPECIFICATION: protect (Authentication Middleware)
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Extract Bearer token from the incoming "Authorization" HTTP header.
 * 2. If token is missing, return 401 Unauthorized with message "No token provided".
 * 3. Verify the token using process.env.JWT_SECRET.
 * 4. Find the user in the database by decoded user.id (excluding passwordHash).
 * 5. If user not found, return 401 Unauthorized.
 * 6. Attach the found user document to "req.user" and call next().
 * 7. Catch any token expiration/tampering errors and return 401 "Invalid or expired token".
 */
export async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.'
      });
    }

    const secret = process.env.JWT_SECRET || 'kaushalsetu_sih2026_jwt_secret_key_change_in_production';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
}

/**
 * ============================================================================
 * FUNCTION SPECIFICATION: requireRole (Role-Based Access Control Middleware)
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Accepts allowed roles as arguments, e.g. requireRole('spoc', 'ministry').
 * 2. Checks if req.user exists and if req.user.role is included in the allowed roles.
 * 3. If role matches, call next().
 * 4. If role is unauthorized, return 403 Forbidden with descriptive error message.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of the following roles: [${roles.join(', ')}]. Current role: ${req.user ? req.user.role : 'None'}`
      });
    }
    next();
  };
}
