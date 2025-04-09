import express from "express";
import {
  getAllTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from "../controllers/tutorialController.js";

const router = express.Router();

router.get("/", getAllTutorials);
router.get("/:id", getTutorialById);
router.post("/", createTutorial);
router.put("/:id", updateTutorial);
router.delete("/:id", deleteTutorial);

export default router;
