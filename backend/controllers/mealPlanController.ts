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
  updateDaysArray,
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
  const { userId, startDate, endDate } = req.body; // FRONTEND: Force endDate to be MAX OF 7 DAYS AFTER START

  // make sure userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new MongooseObjectIdError("Meal plan's User ID is invalid"));
    return;
  }

  // date validation
  if (
    !startDate ||
    !endDate ||
    isNaN(Date.parse(startDate)) ||
    isNaN(Date.parse(endDate))
  ) {
    res.status(400).json({ message: "Invalid start or end date." });
    return;
  }

  try {
    const startDateObj = new Date(startDate); // Convert to Date object
    const endDateObj = new Date(endDate); // Convert to Date object
    // function from ../utils/MealPlanUtil.ts
    const numberOfDays = calculateNumberOfDays(startDateObj, endDateObj);

    const newMealPlan = new MealPlanModel({
      userId,
      startDate: startDateObj,
      endDate: endDateObj,
      numberOfDays,
      days: generateEmptyDays(startDateObj, numberOfDays),
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

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    next(new MongooseObjectIdError("Invalid meal plan id"));
    return;
  }

  // date validation
  if (
    !startDate &&
    !endDate &&
    (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate)))
  ) {
    res.status(400).json({ message: "Invalid start or end date." });
    return;
  }
  try {
    const mealPlan = await MealPlanModel.findById(planId);
    if (!mealPlan) {
      next(new NotFoundError("Meal plan not found"));
      return;
    }

    const updatedFields: any = {};
    updatedFields.startDate = new Date(startDate);
    updatedFields.endDate = new Date(endDate);

    const currentNumberOfDays = mealPlan.numberOfDays;
    const newNumberOfDays = calculateNumberOfDays(
      updatedFields.startDate,
      updatedFields.endDate
    );

    // Always update days if startDate or endDate has changed.
    mealPlan.days = updateDaysArray(
      mealPlan.days,
      updatedFields.startDate,
      newNumberOfDays
    );
    mealPlan.numberOfDays = newNumberOfDays;

    //update the object.
    Object.assign(mealPlan, updatedFields);

    const updatedMealPlan = await mealPlan.save();
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.log("Error updating meal plan: ", error);
    next(new DatabaseError("Failed to update meal plan"));
  }
};

export const deleteMealPlan = async (
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
    const deletedMealPlan = await MealPlanModel.findByIdAndDelete(planId);

    if (!deletedMealPlan) {
      next(new NotFoundError("Meal plan not found"));
      return;
    }
    res.status(200).json({ message: "Meal plan successfully deleted" });
  } catch (error) {
    console.log("Error deleting meal plan: ", error);
    next(new DatabaseError("Failed to delete meal plan"));
  }
};

export const addMealEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { planId } = req.params;
  const { date, mealEntry } = req.body;

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

    const dayToUpdate = mealPlan.days.find(
      (day) =>
        day.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!dayToUpdate) {
      next(new NotFoundError("Day inside this meal plan not found"));
      return;
    }

    dayToUpdate.meals = dayToUpdate.meals.filter((meal) => meal !== null);
    dayToUpdate.meals.push(mealEntry);

    // save current mealPlan after adding new mealEntry data
    await mealPlan.save();

    res
      .status(201)
      .json({ message: "Meal entry added successfully", mealPlan });
  } catch (error) {
    console.error("Error adding meal entry:", error);
    next(new DatabaseError("Failed to add meal entry"));
  }
};

export const deleteMealEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { planId, entryId } = req.params;
  const { date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    next(new MongooseObjectIdError("Invalid meal plan id"));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(entryId)) {
    next(new MongooseObjectIdError("Invalid meal entry id"));
    return;
  }

  try {
    const mealPlan = await MealPlanModel.findById(planId);
    if (!mealPlan) {
      next(new NotFoundError("Meal plan not found"));
      return;
    }

    const dayToUpdate = mealPlan.days.find(
      (day) =>
        day.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!dayToUpdate) {
      next(new NotFoundError("Day inside this meal plan not found"));
      return;
    }

    const initialMealsLength = dayToUpdate.meals.length;

    dayToUpdate.meals = dayToUpdate.meals.filter((meal) => {
      console.log("entryId:", entryId);
      console.log("meal._id:", meal?._id?.toString());
      return meal?._id?.toString() !== entryId;
    });

    const finalMealsLength = dayToUpdate.meals.length;

    if (initialMealsLength === finalMealsLength) {
      next(new NotFoundError("Meal entry not found on the specified date."));
      return;
    }

    // save meal plan after removing meal entry
    await mealPlan.save();

    res
      .status(200)
      .json({ message: "Meal entry removed successfully", mealPlan });
  } catch (error) {
    console.log("Error deleting meal entry: ", error);
    next(new DatabaseError("Failed to delete meal entry"));
  }
};

export const addMiscItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deleteMiscItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// export const g = async (req: Request, res: Response, next: NextFunction) => {};
