import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getCounterargs,
  likeDislike,
  recordCounterarg,
} from "../controllers/counterargument.controller.js";

const router = express.Router();

router.post("/record", verifyToken, recordCounterarg);
router.put("/like", verifyToken, likeDislike);
router.get("/getcounterargs", verifyToken, getCounterargs);

export default router;
