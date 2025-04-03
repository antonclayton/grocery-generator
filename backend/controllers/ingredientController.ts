import { NextFunction, Request, Response } from "express";
import { IngredientModel } from "../models/ingredientModel";
import { DatabaseError } from "../customErrors/DatabaseError";

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
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
