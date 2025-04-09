import express from 'express';
import {
  getAllPlans,
  
  createPlan,
  updatePlan,
 
} from '../controllers/annualplanController.js';

const router = express.Router();

router.get('/', getAllPlans);

router.post('/', createPlan);
router.put('/:id', updatePlan);


export default router;
