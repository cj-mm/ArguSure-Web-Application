import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getAllUsers,
  getDetailsMonth,
  getDetailsTotal,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/gettotal", verifyToken, getDetailsTotal);
router.get("/getpastmonth", verifyToken, getDetailsMonth);
router.get("/getallusers", verifyToken, getAllUsers);

export default router;
