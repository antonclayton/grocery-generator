import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../customErrors";

export function requireAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //   console.log("Session in requireAuthenticated:", req.session);
  //   console.log("req.isAuthenticated():", req.isAuthenticated());
  //   console.log("req.user:", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  next(new UnauthorizedError("Unauthorized Request"));
  return;
}
