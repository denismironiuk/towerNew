import express from 'express';
import {
  assignCertificationToUser,
  getAllAssignedCertifications
} from '../controllers/userCertificationController.js';

const router = express.Router();

// POST /api/certifications/assign
router.post('/assign', assignCertificationToUser);

// GET /api/certifications/assigned
router.get('/', getAllAssignedCertifications);

export default router;
