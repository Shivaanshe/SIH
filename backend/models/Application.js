import mongoose from 'mongoose';

/**
 * Application Schema
 * Records student submissions for internships/placements, tracking computed match score, gap report, and HR status.
 */
const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'StudentProfile'
  },
  postingId: {
    type: String,
    required: true,
    ref: 'JobPosting'
  },
  appliedAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected'],
    default: 'Applied'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  gapReport: [
    {
      skillId: String,
      skillName: String,
      requiredLevel: Number,
      studentLevel: Number,
      gapSize: Number,
      importance: String,
      priorityScore: Number
    }
  ]
}, {
  timestamps: true
});

export const Application = mongoose.model('Application', applicationSchema);
