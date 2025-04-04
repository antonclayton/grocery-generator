import { IDaySchedule } from "../models/mealPlanModel";

export function calculateNumberOfDays(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const differenceInDays = Math.round(
    Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
  );
  return differenceInDays + 1; // + 1 for inclusive end date
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

export function updateDaysArray(
  days: IDaySchedule[],
  startDate: Date,
  numberOfDays: number
): IDaySchedule[] {
  const updatedDays: IDaySchedule[] = [];
  let currentDate = new Date(startDate); // new current date

  for (let i = 0; i < numberOfDays; i++) {
    const existingDay = days.find(
      // tries to match date
      (day) => day.date.getTime() === currentDate.getTime()
    );

    if (existingDay) {
      updatedDays.push(existingDay); // Preserves existing day schedules if their dates match.
    } else {
      updatedDays.push({
        date: new Date(currentDate),
        meals: [],
        miscItems: [],
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // function ensures that the updatedDays array has the correct number of days and dates, based on the provided startDate and numberOfDays.
  return updatedDays;
}
