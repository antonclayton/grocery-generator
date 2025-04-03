import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/recipeModel";
import { DatabaseError } from "../customErrors/DatabaseError";
import { MongooseObjectIdError, NotFoundError } from "../customErrors";

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipes = await RecipeModel.find().lean();
    res.status(200).json(recipes);
  } catch (error) {
    console.log("Error getting recipes: ", error);
    next(new DatabaseError("Failed to get all recipes"));
  }
};

export const getRecipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Recipe's ID is invalid"));
    return;
  }

  try {
    const recipe = await RecipeModel.findById(id).lean();
    if (!recipe) {
      next(new NotFoundError(`Recipe with ID ${id} cannot be found`));
      return;
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.log("Error getting recipe: ", error);
    next(new DatabaseError("Failed to get recipe"));
  }
};

export const createNewRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
