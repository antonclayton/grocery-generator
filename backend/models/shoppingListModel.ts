import mongoose, { Schema, Document } from "mongoose";

interface IItems {
  ingredientId: Schema.Types.ObjectId;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

interface IShoppingList {
  userId: Schema.Types.ObjectId;
  title: string;
  items: IItems[];
}

interface ShoppingListDocument extends IShoppingList, Document {}

const shoppingListSchema = new Schema<ShoppingListDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        isChecked: {
          // checkbox for if the user has obtained this item or not
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const ShoppingListModel = mongoose.model("ShoppingList", shoppingListSchema);

export { ShoppingListModel };
