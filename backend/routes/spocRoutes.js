import express from 'express';
import {
  getCohortStudents,
  endorseStudentSkill,
  getCurriculumGapRadar,
  generateCurriculumActionPlan
} from '../controllers/spocController.js';

const router = express.Router();

router.get('/cohort', getCohortStudents);
router.post('/endorse-skill', endorseStudentSkill);
router.get('/curriculum-radar', getCurriculumGapRadar);
router.post('/action-plan', generateCurriculumActionPlan);

export default router;
