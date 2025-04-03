import express from "express";
const router = express.Router();

import { requireAuthenticated } from "../middleware/authMiddleware";

router.use(requireAuthenticated);

// TODO pagination for this request
router.get("/");
router.get("/:id");
router.post("/");
router.delete("/:id");
router.patch("/:id");

export default router;
