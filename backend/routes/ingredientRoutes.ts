import express from "express";
const router = express.Router();
import {
  getAllIngredients,
  createNewIngredient,
  deleteIngredient,
  getAllIngredientCategories,
  createNewIngredientCategory,
  deleteIngredientCategory,
} from "../controllers/ingredientController";

import { requireAuthenticated } from "../middleware/authMiddleware";

router.use(requireAuthenticated);

// ingredients
router.get("/", getAllIngredients);
router.post("/", createNewIngredient);
router.delete("/:id", deleteIngredient);

// ingredient categories
router.get("/categories", getAllIngredientCategories);
router.post("/categories", createNewIngredientCategory);
router.delete("/categories/:id", deleteIngredientCategory);

export default router;
