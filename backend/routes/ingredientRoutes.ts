import express from "express";
const router = express.Router();
import {
  getAllIngredients,
  createNewIngredient,
  deleteIngredient,
} from "../controllers/ingredientController";

import { requireAuthenticated } from "../middleware/authMiddleware";

router.use(requireAuthenticated);

router.get("/", getAllIngredients);
router.post("/", createNewIngredient);
router.delete("/:id", deleteIngredient);

export default router;
