import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  getJobApplicants
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.get('/:id/applicants', getJobApplicants);

export default router;
