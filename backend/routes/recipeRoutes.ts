import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";
import {
  createNewRecipe,
  createNewRecipeCategory,
  deleteRecipe,
  deleteRecipeCategory,
  getAllRecipeCategories,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
} from "../controllers/recipeController";

router.use(requireAuthenticated);

// ORDER FROM MOST SPECIFIC TO LEAST SPECIFIC TO AVOID UNINTENDED PATH MATCHES

// recipe categories
router.get("/categories", getAllRecipeCategories);
router.post("/categories", createNewRecipeCategory);
router.delete("/categories/:id", deleteRecipeCategory);

// recipe
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", createNewRecipe);
router.delete("/:id", deleteRecipe);
router.patch("/:id", updateRecipe);

export default router;
