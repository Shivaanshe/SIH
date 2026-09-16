import express from 'express';
import {
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  uploadResumeNLP,
  applyToJob,
  getMyApplications,
  verifyDigiLocker
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getAllStudents);
router.get('/:id', getStudentProfile);
router.put('/:id', updateStudentProfile);
router.post('/parse-resume', uploadResumeNLP);
router.post('/apply', applyToJob);
router.get('/:studentId/applications', getMyApplications);
router.post('/:id/verify-digilocker', verifyDigiLocker);

export default router;
