import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { RecipeCategoryModel, RecipeModel } from "../models/recipeModel";
import {
  MongooseObjectIdError,
  NotFoundError,
  DatabaseError,
  UnauthorizedError,
} from "../customErrors";
//Recipes
export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;

  const page = parseInt(req.query.page as string) || 1; // default 1st page
  const limit = parseInt(req.query.limit as string) || 10; // 10 recipe limit per page
  try {
    const recipes = await RecipeModel.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // get total number of recipes
    const totalRecipes = await RecipeModel.countDocuments({ userId });

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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Recipe's ID is invalid"));
    return;
  }

  try {
    // Query for a recipe that matches both the ID and the current user's ID
    const recipe = await RecipeModel.findOne({
      _id: id,
      userId: userId,
    }).lean();

    if (!recipe) {
      next(
        new NotFoundError(
          `Recipe cannot be found or does not belong to the current user`
        )
      );
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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;

  const {
    title,
    description,
    ingredients,
    instructions,
    categories,
    isFavorite,
  } = req.body;

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Recipe's User ID is invalid"));
    return;
  }

  // If categories is provided, ensure it's an array of valid ObjectIds
  if (categories) {
    const invalidCategories = categories.filter(
      (categoryId: any) => !mongoose.Types.ObjectId.isValid(categoryId)
    );
    if (invalidCategories.length > 0) {
      next(new MongooseObjectIdError("One or more Category IDs are invalid"));
      return;
    }
  }

  try {
    const newRecipe = new RecipeModel({
      userId,
      title,
      description,
      ingredients,
      instructions,
      categories,
      isFavorite,
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid recipe ID"));
    return;
  }

  try {
    // delete only if it exists
    const deleted = await RecipeModel.findByIdAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deleted) {
      // recipe either doesn't exist or doesn't belong to the user
      next(new NotFoundError("Recipe not found or doesn't belong to the user"));
      return;
    }

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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;
  const { id } = req.params;
  const {
    title,
    description,
    ingredients,
    instructions,
    categories,
    isFavorite,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid recipe ID"));
    return;
  }

  // If categories is provided, ensure it's an array of valid ObjectIds
  if (categories) {
    const invalidCategories = categories.filter(
      (categoryId: any) => !mongoose.Types.ObjectId.isValid(categoryId)
    );
    if (invalidCategories.length > 0) {
      next(new MongooseObjectIdError("One or more Category IDs are invalid"));
      return;
    }
  }

  try {
    // find recipe first
    const recipe = await RecipeModel.findOne({ _id: id, userId });
    if (!recipe) {
      next(
        new NotFoundError("Recipe not found or does not belong to current user")
      );
      return;
    }

    // check which fields to update based on if they exist
    const updatedFields: any = {};
    if (title) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (ingredients) updatedFields.ingredients = ingredients;
    if (instructions !== undefined) updatedFields.instructions = instructions;
    if (categories !== undefined) updatedFields.categories = categories;
    if (isFavorite !== undefined) updatedFields.isFavorite = isFavorite;

    // updated recipe
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      { _id: id, userId },
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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;
  try {
    const recipeCategories = await RecipeCategoryModel.find({ userId }).lean();
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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;
  const { name } = req.body;

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

    res.status(201).json(savedRecipe);
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
  if (!req.user) {
    next(new UnauthorizedError("User not authenticated"));
    return;
  }

  const userId = (req.user as any)._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new MongooseObjectIdError("Invalid recipe category ID"));
    return;
  }

  try {
    // make sure recipe exists before deleting
    const deletedRecipeCategory = await RecipeCategoryModel.findByIdAndDelete({
      _id: id,
      userId,
    });

    if (!deletedRecipeCategory) {
      next(
        new NotFoundError(
          "Recipe category not found or doesn't belong to the user"
        )
      );
      return;
    }

    // success
    res.status(204).json({ message: "Recipe category deleted successfully" });
  } catch (error) {
    console.log("Error deleting recipe category: ", error);
    next(new DatabaseError("Failed to delete recipe category"));
  }
};
