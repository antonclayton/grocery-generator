import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";

router.use(requireAuthenticated);

router.get("/");

export default router;
