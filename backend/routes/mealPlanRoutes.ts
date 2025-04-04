import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";
import {
  createMealPlan,
  deleteMealPlan,
  getAllMealPlans,
  getMealPlanById,
  updateMealPlan,
} from "../controllers/mealPlanController";

router.use(requireAuthenticated);

router.get("/", getAllMealPlans);
router.get("/:planId", getMealPlanById);
router.post("/", createMealPlan);
router.patch("/:planId", updateMealPlan);
router.delete("/:planId", deleteMealPlan);

export default router;
