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

// recipe
router.get("/", getAllRecipes); // TODO pagination for this request
router.get("/:id", getRecipeById);
router.post("/", createNewRecipe);
router.delete("/:id", deleteRecipe);
router.patch("/:id", updateRecipe);

// recipe categories
router.get("/categories", getAllRecipeCategories);
router.post("/categories", createNewRecipeCategory);
router.delete("/categories/:id", deleteRecipeCategory);

export default router;
