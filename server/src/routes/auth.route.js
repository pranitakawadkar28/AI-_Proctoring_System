import express from "express";
import { registerController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user/register", registerController)

export default router;