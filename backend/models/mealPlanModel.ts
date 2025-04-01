import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mealPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    days: [
      {
        date: Date,
        meals: [
          {
            recipeId: {
              // user selected recipe
              type: Schema.Types.ObjectId,
              ref: "Recipe",
              default: null,
            },
            mealName: {
              // user inputted
              type: String,
              default: null,
            },
            mealType: {
              type: String,
              enum: ["breakfast", "lunch", "dinner", "snack"],
              required: true,
            },
          },
        ],
        miscItems: [
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
      },
    ],
  },
  { timestamps: true }
);

const MealPlanModel = mongoose.model("MealPlan", mealPlanSchema);

export { MealPlanModel };
