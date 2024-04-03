import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { saveCounterarg } from "../controllers/counterargument.controller.js";

const router = express.Router();

router.post("/save", verifyToken, saveCounterarg);

export default router;
