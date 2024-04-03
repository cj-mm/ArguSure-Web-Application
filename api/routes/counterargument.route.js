import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getDislikes,
  getHistory,
  getLikes,
  likeDislike,
  saveCounterarg,
} from "../controllers/counterargument.controller.js";

const router = express.Router();

router.post("/save", verifyToken, saveCounterarg);
router.put("/like", verifyToken, likeDislike);
router.get("/getlikes", verifyToken, getLikes);
router.get("/getdislikes", verifyToken, getDislikes);
router.get("/gethistory", verifyToken, getHistory);

export default router;
