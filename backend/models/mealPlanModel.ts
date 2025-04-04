import mongoose, { Schema, Document } from "mongoose";

interface IMealEntry {
  _id?: Schema.Types.ObjectId;
  recipeId?: Schema.Types.ObjectId;
  mealName?: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

interface IMiscItem {
  _id?: Schema.Types.ObjectId;
  ingredientId: Schema.Types.ObjectId;
  quantity: number;
  unit: string;
}

export interface IDaySchedule {
  date: Date;
  meals: IMealEntry[];
  miscItems: IMiscItem[];
}

interface IMealPlan {
  userId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  days: IDaySchedule[];
}

interface MealPlanDocument extends IMealPlan, Document {}

const mealEntrySchema = new Schema<IMealEntry>({
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
});

const miscItemSchema = new Schema<IMiscItem>({
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
});

const dayScheduleSchema = new Schema<IDaySchedule>({
  date: {
    type: Date,
    required: true,
  },
  meals: [mealEntrySchema],
  miscItems: [miscItemSchema],
});

const mealPlanSchema = new Schema<MealPlanDocument>(
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
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    days: [dayScheduleSchema],
  },
  { timestamps: true }
);

const MealPlanModel = mongoose.model("MealPlan", mealPlanSchema);

export { MealPlanModel };
