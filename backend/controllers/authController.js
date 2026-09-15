import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';

/**
 * Generate JWT token utility
 */
function generateToken(id, role) {
  const secret = process.env.JWT_SECRET || 'kaushalsetu_sih2026_jwt_secret_key_change_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role }, secret, { expiresIn });
}

/**
 * ============================================================================
 * FUNCTION: registerUser
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'name', 'email', 'password', 'role', 'institutionId' from req.body.
 * 2. Validate that email and password are provided.
 * 3. Check if a User with the given email already exists. If so, return 400 Bad Request.
 * 4. Hash the password using bcrypt (salt rounds = 10).
 * 5. Create new User document in MongoDB.
 * 6. If role === 'student', automatically create an associated initial StudentProfile record.
 * 7. Generate JWT token.
 * 8. Return 201 Created with { success: true, token, user: { id, name, email, role } }.
 *
 * HTTP METHOD & ROUTE: POST /api/auth/register
 * ACCESS: Public
 */
export async function registerUser(req, res, next) {
  try {
    const { name, email, password, role = 'student', institutionId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email is already registered.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
      institutionId
    });

    // If student, create empty profile stub
    if (role === 'student') {
      await StudentProfile.create({
        userId: newUser._id,
        id: `stud-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        institutionId: institutionId || '',
        skills: [],
        projects: []
      });
    }

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: loginUser
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'email' and 'password' from req.body.
 * 2. Find user in MongoDB by email, explicitly including "+passwordHash".
 * 3. If user not found, return 401 Unauthorized ("Invalid credentials").
 * 4. Compare incoming password with stored passwordHash using bcrypt.compare().
 * 5. If passwords do not match, return 401 Unauthorized.
 * 6. Generate JWT token.
 * 7. Return 200 OK with { success: true, token, user: { id, name, email, role, avatar } }.
 *
 * HTTP METHOD & ROUTE: POST /api/auth/login
 * ACCESS: Public
 */
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    // Universal demo/master account support for shiv@123
    if (normalizedEmail === 'shiv@123' && password === '123') {
      const targetRole = req.body.role || (user ? user.role : 'student');
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123', salt);
        user = await User.create({
          name: 'Shiv Sharma',
          email: 'shiv@123',
          passwordHash,
          role: targetRole,
          institutionId: 'inst-aiia-01'
        });

        if (targetRole === 'student') {
          await StudentProfile.create({
            userId: user._id,
            id: 'stud-shiv-01',
            name: 'Shiv Sharma',
            email: 'shiv@123',
            institutionId: 'inst-aiia-01',
            institutionName: 'All India Institute of Ayurveda (AIIA), New Delhi',
            degree: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
            year: 'Final Year (Batch 2026)',
            apaarId: 'IN-APAAR-2026-SHIV-1234',
            digiLockerVerified: true,
            verificationConfidence: 0.9,
            skills: [
              { skillId: 'ayush-pk-01', name: 'Panchakarma Protocol & Procedures', level: 4, verified: true, endorsedBy: 'Dr. Arvind Verma' },
              { skillId: 'ayush-kaya-02', name: 'Kayachikitsa (Internal Medicine & Diagnostics)', level: 4, verified: true, endorsedBy: 'Dr. Arvind Verma' }
            ],
            projects: [],
            appliedPostings: []
          });
        }
      } else if (req.body.role && user.role !== req.body.role) {
        user.role = req.body.role;
        await user.save();
      }

      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getCurrentUser
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read authenticated user from req.user (attached by authMiddleware.protect).
 * 2. If user is a student, populate or fetch associated StudentProfile.
 * 3. Return 200 OK with { success: true, user, profile }.
 *
 * HTTP METHOD & ROUTE: GET /api/auth/me
 * ACCESS: Private (Authenticated)
 */
export async function getCurrentUser(req, res, next) {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({
        $or: [{ userId: user._id }, { email: user.email }]
      });
    }

    res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
}
