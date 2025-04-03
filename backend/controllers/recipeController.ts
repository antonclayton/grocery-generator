import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { RecipeCategoryModel, RecipeModel } from "../models/recipeModel";
import { DatabaseError } from "../customErrors/DatabaseError";
import { MongooseObjectIdError, NotFoundError } from "../customErrors";

//Recipes
export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1; // default 1st page
  const limit = parseInt(req.query.limit as string) || 10; // 10 recipe limit per page
  try {
    const recipes = await RecipeModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // get total number of recipes
    const totalRecipes = await RecipeModel.countDocuments();

    res.status(200).json({
      recipes,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limit), // for use in the frontend
      currentPage: page,
    });
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
) => {
  const {
    userId,
    title,
    description,
    ingredients,
    instructions,
    category,
    isFavorite,
  } = req.body;

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Recipe's User ID is invalid"));
    return;
  }

  if (category && !mongoose.Types.ObjectId.isValid(category)) {
    next(new MongooseObjectIdError("recipe's category ID is invalid"));
    return;
  }

  try {
    const newRecipe = new RecipeModel({
      userId,
      title,
      description,
      ingredients,
      instructions,
      category,
      isFavorite,
    });

    const savedRecipe = await newRecipe.save();

    res.status(200).json(savedRecipe);
  } catch (error) {
    console.log("Error creating recipe: ", error);
    next(new DatabaseError("Failed to create recipe"));
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid recipe ID"));
    return;
  }

  try {
    // make sure recipe exists before deleting
    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      next(new NotFoundError("Recipe not found"));
      return;
    }

    // find and delete
    await RecipeModel.findByIdAndDelete(id);

    // success
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.log("Error deleting recipe: ", error);
    next(new DatabaseError("Failed to delete recipe"));
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, title, description, ingredients, category, isFavorite } =
    req.body;

  // make sure userId is valid
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Recipe's User ID is invalid"));
    return;
  }

  if (category && !mongoose.Types.ObjectId.isValid(category)) {
    next(new MongooseObjectIdError("recipe's category ID is invalid"));
    return;
  }

  try {
    // find recipe first
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      next(new NotFoundError("Recipe not found"));
      return;
    }

    // check which fields to update based on if they exist
    const updatedFields: any = {};
    if (title) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (ingredients) updatedFields.ingredients = ingredients;
    if (category !== undefined) updatedFields.category = category;
    if (isFavorite !== undefined) updatedFields.isFavorite = isFavorite;

    // updated recipe
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true, // return updated document
      }
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.log("Error updating recipe");
    next(new DatabaseError("Failed to upadte recipe"));
  }
};

// recipe categories
export const getAllRecipeCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipeCategories = await RecipeCategoryModel.find().lean();
    res.status(200).json(recipeCategories);
  } catch (error) {
    console.log("Error getting recipe categories: ", error);
    next(new DatabaseError("Failed to get all recipe categories"));
  }
};

export const createNewRecipeCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, userId } = req.body;

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Recipe category's User ID is invalid"));
    return;
  }

  try {
    const newRecipe = new RecipeCategoryModel({
      name,
      userId,
    });

    const savedRecipe = await newRecipe.save();

    res.status(200).json(savedRecipe);
  } catch (error) {
    console.log("Error creating recipe category: ", error);
    next(new DatabaseError("Failed to create recipe category"));
  }
};

export const deleteRecipeCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid recipe category ID"));
    return;
  }

  try {
    // make sure recipe exists before deleting
    const recipeCategory = await RecipeCategoryModel.findById(id);

    if (!recipeCategory) {
      next(new NotFoundError("Recipe category not found"));
      return;
    }

    // find and delete
    await RecipeCategoryModel.findByIdAndDelete(id);

    // success
    res.status(200).json({ message: "Recipe category deleted successfully" });
  } catch (error) {
    console.log("Error deleting recipe category: ", error);
    next(new DatabaseError("Failed to delete recipe category"));
  }
};
