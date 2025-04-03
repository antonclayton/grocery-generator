import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { IngredientModel } from "../models/ingredientModel";
import { DatabaseError } from "../customErrors/DatabaseError";
import {
  DuplicateError,
  MongooseObjectIdError,
  NotFoundError,
} from "../customErrors";

export const getAllIngredients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ingredients = await IngredientModel.find(); // find all
    res.status(200).json(ingredients);
  } catch (error) {
    console.log("Error getting ingredients: ", error);
    next(new DatabaseError("Failed to fetch ingredients"));
  }
};

export const createNewIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, category, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    next(new MongooseObjectIdError("Ingredient's category ID is invalid"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Ingredient's User ID is invalid"));
    return;
  }

  try {
    const existingIngredient = await IngredientModel.findOne({ name });

    if (existingIngredient) {
      next(new DuplicateError("Ingredient with this name already exists"));
      return;
    }

    const newIngredient = new IngredientModel({
      name,
      category,
      userId,
    });

    const savedIngredient = await newIngredient.save(); // save to database

    res.status(200).json(savedIngredient);
  } catch (error) {
    console.log("Error creating new ingredient: ", error);
    next(new DatabaseError("Failed to create ingredient"));
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid ingredient ID"));
    return;
  }

  try {
    // make sure ingredient exists before deleting
    const ingredient = await IngredientModel.findById(id);

    if (!ingredient) {
      next(new NotFoundError("Ingredient not found"));
      return;
    }

    // find and delete ingredient
    await IngredientModel.findByIdAndDelete(id);

    // success
    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    console.log("Error deleting ingredient: ", error);
    next(new DatabaseError("Failed to delete ingredient"));
  }
};
