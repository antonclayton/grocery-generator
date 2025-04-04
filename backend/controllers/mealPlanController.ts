import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  MongooseObjectIdError,
  NotFoundError,
  DatabaseError,
} from "../customErrors";
import { MealPlanModel } from "../models/mealPlanModel";
import {
  calculateNumberOfDays,
  generateEmptyDays,
} from "../utils/MealPlanUtil";

export const getAllMealPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mealPlans = await MealPlanModel.find();
    res.status(200).json(mealPlans);
  } catch (error) {
    console.log("Error getting meal plans: ", error);
    next(new DatabaseError("Failed to get meal plans"));
  }
};

export const getMealPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { planId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    next(new MongooseObjectIdError("Invalid meal plan id"));
    return;
  }

  try {
    const mealPlan = await MealPlanModel.findById(planId);
    if (!mealPlan) {
      next(new NotFoundError("Meal plan not found"));
      return;
    }

    res.status(200).json(mealPlan);
  } catch (error) {
    console.log("Error getting meal plan: ", error);
    next(new DatabaseError("Failed to get meal plan"));
  }
};

export const createMealPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, startDate, endDate } = req.body;

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Meal plan's User ID is invalid"));
    return;
  }

  try {
    // function from ../utils/MealPlanUtil.ts
    const numberOfDays = calculateNumberOfDays(startDate, endDate);

    const newMealPlan = new MealPlanModel({
      userId,
      startDate,
      endDate,
      numberOfDays,
      days: generateEmptyDays(startDate, numberOfDays),
    });

    const savedMealPlan = await newMealPlan.save();
    res.status(201).json(savedMealPlan);
  } catch (error) {
    console.error("Error creating meal plan:", error);
    next(new DatabaseError("Failed to create meal plan"));
  }
};

export const updateMealPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { startDate, endDate } = req.body;
  const { planId } = req.params;
};

export const deleteMealPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// export const g = async (req: Request, res: Response, next: NextFunction) => {};

// export const g = async (req: Request, res: Response, next: NextFunction) => {};
