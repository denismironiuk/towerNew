import express from "express";
import {
  getAuditRecordById,
  getAuditRecords,
  addAuditRecord,
  updateAuditRecord,
  deleteAuditRecord,
} from "../controllers/auditRecordController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAuditRecords); 
router.get("/:id", authenticate, getAuditRecordById);
router.post("/", authenticate, addAuditRecord);
router.put("/:id", authenticate, updateAuditRecord);
router.delete("/:id", authenticate, deleteAuditRecord);

export default router;
