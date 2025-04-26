import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../config/environment";
import { IUser } from "../models/user.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import {
  TokenPayload,
  AuthResponse,
  UserWithoutPassword,
  UserWithPassword,
  UserWithComparePassword,
} from "../types/auth.types";

// Register a new user
export const register = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw error;
  }
};

// Login a user
export const login = async (
  email: string,
  password: string
): Promise<{ user: UserWithoutPassword; token: string }> => {
  try {
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as UserWithPassword;
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    // Create a user object to return (without password)
    const userObject: UserWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userObject, token };
  } catch (error) {
    throw error;
  }
};

// Generate JWT token
export const generateToken = (
  user: IUser | { _id: mongoose.Types.ObjectId }
): string => {
  return jwt.sign({ id: user._id.toString() }, env.jwt_secret, {
    expiresIn: "7d",
  });
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.jwt_secret) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Register user
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const user = (await User.create({
    name,
    email,
    password,
  })) as IUser;

  // Generate token
  const token = generateToken(user);

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    token,
  };
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user by email
  const user = (await User.findOne({ email })) as UserWithComparePassword;
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if password is correct
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    token,
  };
};
