import mongoose, { Schema, Document } from "mongoose";

interface IIngredient {
  name: string;
  category?: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

interface IngredientDocument extends IIngredient, Document {}

const ingredientSchema = new Schema<IngredientDocument>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "IngredientCategory",
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const IngredientModel = mongoose.model("Ingredient", ingredientSchema);

interface IIngredientCategory {
  name: string;
  userId: Schema.Types.ObjectId;
}

interface IngredientCategoryDocument extends IIngredientCategory, Document {}

const ingredientCategorySchema = new Schema<IngredientCategoryDocument>({
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
