import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { getWorkersForManager, getWorkerProfile, getFabManagers,getWorkersByRole } from "../controllers/userController.js";

const router = express.Router();

// ✅ Get workers assigned to a manager (Only "sam" or "admin")
router.get("/workers", authenticate, getWorkersForManager);

router.get("/workersByRole",getWorkersByRole );
// ✅ Get worker profile by employee_number
router.get("/workers/:employee_number", authenticate, getWorkerProfile);

// ✅ Get all Fab Managers
router.get("/fab-managers", getFabManagers);

export default router;
