import express from 'express';
import {
  getMatchesForStudent,
  getRankedCandidatesForJob
} from '../controllers/matchingController.js';

const router = express.Router();

router.get('/student/:studentId', getMatchesForStudent);
router.get('/job/:jobId/candidates', getRankedCandidatesForJob);

export default router;
