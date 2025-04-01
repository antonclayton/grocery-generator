import mongoose from "mongoose";
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
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
    ingredients: [
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
      },
    ],
    instructions: {
      type: String,
      default: "",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "RecipeCategory",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RecipeModel = mongoose.model("Recipe", recipeSchema);

const recipeCategorySchema = new Schema({
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

const RecipeCategoryModel = mongoose.model(
  "RecipeCategory",
  recipeCategorySchema
);

export { RecipeModel, RecipeCategoryModel };
