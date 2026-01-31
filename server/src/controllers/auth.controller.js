import { ZodError } from "zod";
import { loginUser, registerUser } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { NODE_ENV } from "../config/env.js";

export const registerController = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    // Zod validation error
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    // Business logic error (duplicate user)
    if (error.message === "User already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { user, token } = await loginUser(validatedData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (error) {

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
