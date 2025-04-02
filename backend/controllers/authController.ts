import passport from "passport";
import { Request, Response } from "express";

// "Take the user to Google to log in."
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// "Google sent the user back; now, verify their login and create a session."
export const googleAuthCallback = (req: Request, res: Response, next: any) => {
  passport.authenticate("google", { failureRedirect: "/login" })(
    req,
    res,
    (err: Error) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    }
  );
};

export const logoutUser = (req: any, res: Response) => {
  console.log("logoutUser called");
  req.logout(() => {
    console.log("req.logout() callback");
    req.session.destroy(() => {
      console.log("req.session.destroy() callback");
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};

export const getProfile = (req: any, res: Response) => {
  res.json({ user: req.user });
};
