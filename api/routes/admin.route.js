import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getDetailsTotal } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/gettotal", verifyToken, getDetailsTotal);

export default router;
