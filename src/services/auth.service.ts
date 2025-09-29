import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "imafuckingdumbass";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

// register user
export async function register(
  email: string,
  password: string,
  username: string
) {
  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    username,
  });
  const token = generateToken(user.id.toString());

  return {
    user: { id: user.id, email: user.email, username: user.username },
    token,
  };
}

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user.id.toString());
  return {
    user: { id: user.id, email: user.email, username: user.username },
    token,
  };
};
