import mongoose, { Schema, Document } from "mongoose";

interface IRecipeIngredient {
  ingredientId: Schema.Types.ObjectId;
  quantity: number;
  unit: string;
}

interface IRecipe {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  ingredients: IRecipeIngredient[];
  instructions?: string;
  category: Schema.Types.ObjectId;
  isFavorite: boolean;
}

interface RecipeDocument extends IRecipe, Document {}

const recipeSchema = new Schema<RecipeDocument>(
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
          required: true,
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

interface IRecipeCategory {
  name: string;
  userId: Schema.Types.ObjectId;
}

interface RecipeCategoryDocument extends IRecipeCategory, Document {}

const recipeCategorySchema = new Schema<RecipeCategoryDocument>({
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
