import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
    failedLoginAttempts: { 
      type: Number, 
      default: 0 
    },
    lockUntil: { 
      type: Date 
    },
    lastFailedLogin: { 
      type: Date 
    },
  },
  { timestamps: true },
);

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.getBackoffDelay = function () {
  if (!this.lastFailedLogin) return 0;

  // Exponential backoff: 2^(failedAttempts-1) seconds
  const delay = Math.pow(2, this.failedLoginAttempts - 1);
  const passed = (Date.now() - this.lastFailedLogin.getTime()) / 1000;
  return Math.max(0, delay - passed);
};

export const userModel = mongoose.model("User", userSchema);
