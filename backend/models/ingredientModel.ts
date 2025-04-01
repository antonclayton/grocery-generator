import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "IngredientCategory",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const IngredientModel = mongoose.model("Ingredient", ingredientSchema);

const ingredientCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const IngredientCategoryModel = mongoose.model(
  "IngredientCategory",
  ingredientCategorySchema
);

export { IngredientModel, IngredientCategoryModel };
