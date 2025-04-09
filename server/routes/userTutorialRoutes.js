// routes/userTutorialRoutes.js
import express from 'express';
import { assignTutorialToUser,getAllAssignedTutorials } from '../controllers/userTutorialController.js';

const router = express.Router();

router.post('/assign', assignTutorialToUser);
router.get('/', getAllAssignedTutorials);

export default router;
