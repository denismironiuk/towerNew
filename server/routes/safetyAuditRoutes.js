// routes/safetyAuditRoutes.js

import express from 'express';
import {
  getAllSafetyAudits,
  getSafetyAuditById,
  createSafetyAudit,
  updateSafetyAudit,
  deleteSafetyAudit,
} from '../controllers/safetyAuditController.js';

const router = express.Router();

// Route to fetch all safety audits
router.get('/', getAllSafetyAudits);

// Route to fetch a single safety audit by ID
router.get('/:id', getSafetyAuditById);

// Route to create a new safety audit
router.post('/', createSafetyAudit);

// Route to update an existing safety audit
router.put('/:id', updateSafetyAudit);

// Route to delete a safety audit
router.delete('/:id', deleteSafetyAudit);

export default router;
