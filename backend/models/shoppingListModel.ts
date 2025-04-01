import mongoose from "mongoose";
const Schema = mongoose.Schema;

const shoppingListSchema = new Schema(
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

const ShoppingListModel = mongoose.model("MealPlan", shoppingListSchema);

export { ShoppingListModel };
