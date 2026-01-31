import { userModel } from "../models/user.models.js";
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

  const user = await userModel
    .findOne({ email })
    .select("+password");

  if (!user) throw new Error("Invalid credentials");

    if (user.isLocked()) throw new Error("ACCOUNT_LOCKED");


  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }

    await user.save();
    throw new Error("INVALID_CREDENTIALS");
  }

  // Reset on success
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  const token = generatedToken({
    userId: user._id,
    role: user.role,
});

  return { user: safeUser, token };
};

