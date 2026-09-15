import mongoose from 'mongoose';

/**
 * User Schema — Core Authentication & Role-Based Access Control (RBAC)
 * Roles: 'student', 'spoc', 'recruiter', 'ministry'
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+$/, 'Please enter a valid email or user identifier']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
    select: false // Excluded from query results by default
  },
  role: {
    type: String,
    enum: ['student', 'spoc', 'recruiter', 'ministry'],
    default: 'student'
  },
  institutionId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
