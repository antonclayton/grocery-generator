import { IDaySchedule } from "../models/mealPlanModel";

export function calculateNumberOfDays(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  return Math.round(
    Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
  );
}

export function generateEmptyDays(
  startDate: Date,
  numberOfDays: number
): IDaySchedule[] {
  const days: IDaySchedule[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    days.push({
      date: new Date(currentDate),
      meals: [],
      miscItems: [],
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
}
