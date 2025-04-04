import mongoose, { Schema, Document } from "mongoose";

interface IItems {
  _id?: Schema.Types.ObjectId; // This is the generated _id field (used to mitigate typescript errors);
  ingredientId: Schema.Types.ObjectId;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

interface IShoppingList {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
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
    description: {
      type: String,
      default: "",
    },
    items: {
      type: [
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
      default: [],
    },
  },
  { timestamps: true }
);

const ShoppingListModel = mongoose.model("ShoppingList", shoppingListSchema);

export { ShoppingListModel };
