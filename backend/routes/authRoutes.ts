import express from "express";
import {
  googleAuth,
  googleAuthCallback,
  logoutUser,
  getProfile,
  checkAuth,
} from "../controllers/authController";

import { requireAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.get("/logout", logoutUser);
router.get("/profile", requireAuthenticated, getProfile); // middleware to make sure user is authenticated before getting profile
router.get("/user", checkAuth);
export default router;
