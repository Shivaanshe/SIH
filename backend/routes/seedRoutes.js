import express from 'express';
import {
  getDatabaseStatus,
  seedDatabaseIfEmpty,
  resetDatabase
} from '../controllers/seedController.js';

const router = express.Router();

router.get('/status', getDatabaseStatus);
router.post('/', seedDatabaseIfEmpty);
router.post('/reset', resetDatabase);

export default router;
