import express from "express";
import {
  saveCounterargument,
  unSaveCounterargument,
  addTopic,
  renameTopic,
  deleteTopic,
  getSavedCounterargs,
  getTopics,
} from "../controllers/saved.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/save", verifyToken, saveCounterargument);
router.put("/unsave", verifyToken, unSaveCounterargument);
router.put("/addtopic", verifyToken, addTopic);
router.get("/getsaved", verifyToken, getSavedCounterargs);
router.get("/gettopics", verifyToken, getTopics);

export default router;
