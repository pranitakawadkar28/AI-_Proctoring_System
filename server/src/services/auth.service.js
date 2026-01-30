import { userModel } from "../models/user.models.js";
import { hashPassword } from "../utils/hash.js";

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
