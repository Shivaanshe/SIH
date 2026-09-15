import mongoose from 'mongoose';

/**
 * JobPosting Schema
 * Stores internship and job opportunities with weighted skill requirements, eligibility thresholds, and formula weights.
 */
const jobPostingSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80'
  },
  sector: {
    type: String,
    default: 'General'
  },
  domainPack: {
    type: String,
    enum: ['ayush', 'tech'],
    default: 'ayush'
  },
  location: {
    type: String,
    default: 'New Delhi (Hybrid)'
  },
  stipend: {
    type: String,
    default: 'Competitive'
  },
  type: {
    type: String,
    default: 'Internship'
  },
  mode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  description: {
    type: String,
    default: ''
  },
  eligibility: {
    degree: [{ type: String }],
    minCgpa: { type: Number, default: 0 },
    year: [{ type: String }],
    maxBacklogs: { type: Number, default: 0 }
  },
  requiredSkills: [
    {
      skillId: { type: String, required: true },
      name: { type: String, required: true },
      minLevel: { type: Number, min: 1, max: 5, default: 3 },
      importance: {
        type: String,
        enum: ['must-have', 'nice-to-have'],
        default: 'must-have'
      },
      weight: { type: Number, default: 0.25 }
    }
  ],
  weights: {
    w1_skill: { type: Number, default: 0.45 },
    w2_project: { type: Number, default: 0.20 },
    w3_eligibility: { type: Number, default: 0.15 },
    w4_verification: { type: Number, default: 0.20 }
  },
  applicantsCount: {
    type: Number,
    default: 0
  },
  postedDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

export const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
