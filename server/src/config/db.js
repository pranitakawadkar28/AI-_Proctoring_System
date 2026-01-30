import mongoose from "mongoose";
import { MONGODB_URL } from "../config/env.js";

export const connectDb = async(req, res) => {
    try {
        await mongoose.connect(MONGODB_URL)
        console.log("Database connected!!");
    } catch (error) {
        console.error("Error occurred from Db", error);
        process.exit(1);
    }
}