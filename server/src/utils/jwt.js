import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const generatedToken = (payload) => {
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { expiresIn: "1d" });
};
