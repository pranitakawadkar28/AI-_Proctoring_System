import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user/register", registerController)
router.post("/user/login", loginController)

export default router;