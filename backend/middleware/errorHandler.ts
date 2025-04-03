import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // error handling logic
  if (error instanceof CustomError) {
    res.status(error.StatusCode).json(error.serialize());
  } else {
    console.error("Unexpected error:", error); // Helpful for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default errorHandler;
