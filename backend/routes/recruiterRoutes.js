import express from 'express';
import {
  updateCandidateStatus,
  rejectWithFeedback,
  getRecruiterAnalytics
} from '../controllers/recruiterController.js';

const router = express.Router();

router.put('/applications/status', updateCandidateStatus);
router.post('/applications/reject', rejectWithFeedback);
router.get('/analytics', getRecruiterAnalytics);

export default router;
