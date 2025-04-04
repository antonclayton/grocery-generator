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
) => {
  const { userId, title, description } = req.body;

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Recipe's User ID is invalid"));
    return;
  }

  try {
    const newShoppingList = new ShoppingListModel({
      userId,
      title,
      description,
    });

    const savedShoppingList = await newShoppingList.save();

    res.status(201).json(savedShoppingList);
  } catch (error) {
    console.log("Error creating shopping list: ", error);
    next(new DatabaseError("Failed to create shopping list"));
  }
};

export const updateShoppingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId } = req.params;
  const { userId, title, description } = req.body;

  // make sure userId is valid
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("shopping list's User ID is invalid"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(listId)) {
    next(new MongooseObjectIdError("Invalid shopping list ID"));
    return;
  }

  try {
    // find shopping list first to check if it exists
    const shoppingList = await ShoppingListModel.findById(listId);
    if (!shoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    const updatedFields: any = {};
    if (title) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;

    const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
      listId,
      updatedFields,
      {
        new: true, // return updated shopping list
      }
    );
    res.status(200).json(updatedShoppingList);
  } catch (error) {
    console.log("Error deleting recipe: ", error);
    next(new DatabaseError("Failed to delete recipe"));
  }
};

export const deleteShoppingList = async (
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
    // make sure shopping list by listId exists before deleting
    const shoppingList = await ShoppingListModel.findById(listId);

    if (!shoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    // find and delete
    await ShoppingListModel.findByIdAndDelete(listId);

    // success
    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (error) {
    console.log("Error deleting shopping list: ", error);
    next(new DatabaseError("Failed to delete shopping list"));
  }
};

export const getAllItemsInList = async (
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
    // Find the shopping list by ID and populate the 'ingredientId' field in items
    const shoppingList = await ShoppingListModel.findById(listId).populate(
      "items.ingredientId"
    );

    if (!shoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    res.status(200).json(shoppingList.items);
  } catch (error) {
    console.log("Error retrieving items: ", error);
    next(new DatabaseError("Failed to retrieve items in the shopping list"));
  }
};

export const addItemToList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId } = req.params;
  const { ingredientId, quantity, unit } = req.body;
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    next(new MongooseObjectIdError("Invalid shopping list ID"));
    return;
  }

  try {
    // create new item to push into items array
    const newItem = {
      ingredientId,
      quantity,
      unit,
      isChecked: false, // explicitly setting default value
    };

    const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
      listId,
      { $push: { items: newItem } }, // push new item to shopping list's items
      { new: true } // return updated document
    );

    if (!updatedShoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    // respond with updated shopping list
    res.status(201).json(updatedShoppingList);
  } catch (error) {
    console.log("Error adding item to shopping list: ", error);
    next(new DatabaseError("Failed to add item to shopping list"));
  }
};

export const updateItemInList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId, itemId } = req.params;
  const { ingredientId, quantity, unit, isChecked } = req.body;

  // Validate listId and itemId
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    next(new MongooseObjectIdError("Invalid shopping list ID"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new MongooseObjectIdError("Invalid item ID"));
    return;
  }

  try {
    // prepare updated fields
    const updatedFields: any = {};
    if (ingredientId)
      updatedFields["items.$[item].ingredientId"] = ingredientId;
    if (quantity) updatedFields["items.$[item].quantity"] = quantity;
    if (unit) updatedFields["items.$[item].unit"] = unit;
    if (isChecked !== undefined)
      updatedFields["items.$[item].isChecked"] = isChecked;

    // update item in the shopping list
    const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
      listId, // inside this listId, find matching itemId in items array
      { $set: updatedFields }, //fields to update in the matched item
      {
        new: true, // return updated document
        arrayFilters: [{ "item._id": itemId }], // filters by item ids and then matches itemId to an item in the list -> calls update function on that item
      }
    );

    if (!updatedShoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    res.status(200).json(updatedShoppingList);
  } catch (error) {
    console.log("Error updating item in shopping list: ", error);
    next(new DatabaseError("Failed to update item in shopping list"));
  }
};

export const deleteItemInList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId, itemId } = req.params;

  // Validate listId and itemId
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    next(new MongooseObjectIdError("Invalid shopping list ID"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new MongooseObjectIdError("Invalid item ID"));
    return;
  }

  try {
    const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
      listId,
      { $pull: { items: { _id: itemId } } },
      { new: true } // return updated document with item deleted
    );

    if (!updatedShoppingList) {
      next(new NotFoundError("Shopping list not found"));
      return;
    }

    // respond with updatedShoppingList with item deleted
    res.status(200).json({
      message: "item deleted successfully from list",
      updatedShoppingList,
    });
  } catch (error) {
    console.log("Error deleting item from shopping list: ", error);
    next(new DatabaseError("Failed to delete item from shopping list"));
  }
};
