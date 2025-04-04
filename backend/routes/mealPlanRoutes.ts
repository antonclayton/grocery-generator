import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";
import {
  addMealEntry,
  addMiscItem,
  createMealPlan,
  deleteMealEntry,
  deleteMealPlan,
  deleteMiscItem,
  getAllMealPlans,
  getMealPlanById,
  updateMealPlan,
} from "../controllers/mealPlanController";

router.use(requireAuthenticated);

// mealEntry
router.post("/:planId/add-entry", addMealEntry);
router.delete("/:planId/delete-entry/:entryId", deleteMealEntry);

// miscItem
router.post("/:planId/add-misc", addMiscItem);
router.delete("/:planId/delete-misc/:miscId", deleteMiscItem);

// standard meal plan routes
router.get("/", getAllMealPlans);
router.get("/:planId", getMealPlanById);
router.post("/", createMealPlan);
router.patch("/:planId", updateMealPlan);
router.delete("/:planId", deleteMealPlan);

export default router;
