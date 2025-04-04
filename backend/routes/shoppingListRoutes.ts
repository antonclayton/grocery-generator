import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";
import {
  addItemToList,
  createShoppingList,
  deleteItemInList,
  deleteShoppingList,
  getAllItemsInList,
  getAllShoppingLists,
  getShoppingListById,
  updateItemInList,
  updateShoppingList,
} from "../controllers/shoppingListController";

router.use(requireAuthenticated);

// shopping list's item routes
router.get("/:listId/items", getAllItemsInList); // get all items in a shopping list
router.post("/:listId/add-item", addItemToList); // add an item to a shopping list
router.patch("/:listId/update-item/:itemId", updateItemInList); // update an item in the shopping list
router.delete("/:listId/remove-item/:itemId", deleteItemInList); // delete item in the shopping list

// shopping list routes
router.get("/", getAllShoppingLists); // get all available shopping lists
router.get("/:listId", getShoppingListById); // get shopping list by id
router.post("/", createShoppingList); // create a new shopping list
router.patch("/:listId", updateShoppingList); // update only title and description of a shopping list
router.delete("/:listId", deleteShoppingList); // delete a shopping list

export default router;
