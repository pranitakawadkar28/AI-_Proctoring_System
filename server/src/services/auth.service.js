import { userModel } from "../models/user.models.js";
import { sendEmail } from "../utils/email.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generatedToken } from "../utils/jwt.js";

export const registerUser = async ({ username, email, password, role }) => {
  // Check existing user
  const userExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with HASHED password
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return safeUser;
};

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export const loginUser = async ({ email, password }) => {
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  // Account lock check
  if (user.isLocked()) throw new Error("ACCOUNT_LOCKED");

  // Exponential backoff
  const delay = user.getBackoffDelay();
  if (delay > 0) throw new Error(`BACKOFF_${Math.ceil(delay)}`);

  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) {
    user.failedLoginAttempts += 1;
    user.lastFailedLogin = new Date();

    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
      await user.save();

      // send email
      await sendEmail(
        user.email,
        "Account Locked",
        `Your account has been locked due to multiple failed login attempts. It will unlock after 15 minutes.`,
      );

      throw new Error("ACCOUNT_LOCKED");
    }

    console.log(user);

    await user.save();
    throw new Error("INVALID_CREDENTIALS");
  }

  // Reset on success
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastFailedLogin = undefined;
  await user.save();

  const token = generatedToken({
    userId: user._id,
    role: user.role,
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};
