import mongoose from 'mongoose';

/**
 * StudentProfile Schema
 * Encapsulates academic credentials, verified skills, case logs/projects, and DPI identifiers (APAAR & DigiLocker).
 */
const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  domainPack: {
    type: String,
    enum: ['ayush', 'tech'],
    default: 'ayush'
  },
  institutionId: {
    type: String,
    default: ''
  },
  institutionName: {
    type: String,
    default: ''
  },
  degree: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: 'Final Year (Batch 2026)'
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 8.0
  },
  apaarId: {
    type: String,
    default: ''
  },
  digiLockerVerified: {
    type: Boolean,
    default: false
  },
  verificationConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.55
  },
  skills: [
    {
      skillId: { type: String, required: true },
      name: { type: String, required: true },
      level: { type: Number, min: 1, max: 5, default: 1 },
      verified: { type: Boolean, default: false },
      endorsedBy: { type: String, default: null }
    }
  ],
  projects: [
    {
      title: { type: String, required: true },
      description: { type: String, default: '' },
      tags: [{ type: String }]
    }
  ],
  appliedPostings: [
    {
      postingId: { type: String, required: true },
      appliedAt: { type: String },
      status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected'],
        default: 'Applied'
      },
      matchScore: { type: Number },
      rejectionReason: { type: String, default: '' },
      gapReport: { type: Array, default: [] }
    }
  ]
}, {
  timestamps: true
});

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
