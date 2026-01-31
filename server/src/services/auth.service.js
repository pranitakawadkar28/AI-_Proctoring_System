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

export const loginUser = async ({ email, password }) => {

  const user = await userModel
    .findOne({ email })
    .select("+password");

  if (!user) throw new Error("Invalid credentials");

  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) throw new Error("Invalid credentials");

  const safeUser = user.toObject();
  delete safeUser.password;

  const token = generatedToken({
    userId: user._id,
    role: user.role,
});

  return { user: safeUser, token };
};
