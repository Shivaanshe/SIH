import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResumeNLP,
  applyToJob,
  getMyApplications
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/:id', getStudentProfile);
router.put('/:id', updateStudentProfile);
router.post('/parse-resume', uploadResumeNLP);
router.post('/apply', applyToJob);
router.get('/:studentId/applications', getMyApplications);

export default router;
