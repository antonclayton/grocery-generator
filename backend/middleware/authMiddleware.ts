import { Request, Response, NextFunction } from "express";

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
  res.status(401).json({ message: "Unauthorized" });
}
