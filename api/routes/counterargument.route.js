import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  likeDislike,
  saveCounterarg,
} from "../controllers/counterargument.controller.js";

const router = express.Router();

router.post("/save", verifyToken, saveCounterarg);
router.put("/like", verifyToken, likeDislike);

export default router;
