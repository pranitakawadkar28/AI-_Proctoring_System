import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/user/register", registerController)
router.post("/user/login", loginLimiter, loginController)

export default router;