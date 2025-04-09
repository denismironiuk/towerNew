import express from "express";
import {
  getAuditSections,
  getAuditSectionById,
  getAuditQuestionsBySection,
} from "../controllers/auditController.js";

const router = express.Router();

// ✅ Get all audit sections
router.get("/sections", getAuditSections);

// ✅ Get a specific audit section by ID
router.get("/sections/:sectionId", getAuditSectionById);

// ✅ Get all questions for a specific section
router.get("/sections/:sectionId/questions", getAuditQuestionsBySection);

export default router;
