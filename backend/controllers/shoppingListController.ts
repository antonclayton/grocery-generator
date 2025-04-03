import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ShoppingListModel } from "../models/shoppingListModel";
import { DatabaseError } from "../customErrors/DatabaseError";
import { MongooseObjectIdError, NotFoundError } from "../customErrors";

export const getAllShoppingLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shoppingLists = await ShoppingListModel.find();
    res.status(200).json(shoppingLists);
  } catch (error) {
    console.log("Error getting shopping lists: ", error);
    next(new DatabaseError("Failed to get all shopping lists"));
  }
};
export const getShoppingListById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(listId)) {
    next(new MongooseObjectIdError("Invalid shopping list ID"));
    return;
  }

  try {
    const shoppingList = await ShoppingListModel.findById(listId).lean();
    if (!shoppingList) {
      next(
        new NotFoundError(`Shopping list with ID ${listId} cannot be found`)
      );
      return;
    }
    res.status(200).json(shoppingList);
  } catch (error) {
    console.log("Error getting shopping list: ", error);
    next(new DatabaseError("Failed to get shopping list"));
  }
};

export const createShoppingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateShoppingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteShoppingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getAllItemsInList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const addItemToList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const updateItemInList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteItemInList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
