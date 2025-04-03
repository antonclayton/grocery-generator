import express from "express";
const router = express.Router();
import {
  getAllIngredients,
  createNewIngredient,
  deleteIngredient,
  getAllIngredientCategories,
} from "../controllers/ingredientController";

import { requireAuthenticated } from "../middleware/authMiddleware";

router.use(requireAuthenticated);

// ingredients
router.get("/", getAllIngredients);
router.post("/", createNewIngredient);
router.delete("/:id", deleteIngredient);

// ingredient categories
router.get("/categories", getAllIngredientCategories);
router.post("/categories");
router.delete("/categories/:id");

export default router;
