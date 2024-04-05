import express from "express";
import {
  saveCounterargument,
  addTopic,
  renameTopic,
  deleteTopic,
} from "../controllers/saved.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/save", verifyToken, saveCounterargument);

export default router;
