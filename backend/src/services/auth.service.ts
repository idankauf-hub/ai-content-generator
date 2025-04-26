import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../config/environment";
import { IUser } from "../models/user.model";
import User from "../models/user.model";

// Interface for token payload
export interface TokenPayload {
  id: string;
  email?: string;
  name?: string;
}

// Interface for the auth response
export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

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
): Promise<{ user: any; token: string }> => {
  try {
    const user: any = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    // Create a user object to return (without password)
    const userObject = {
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
export const generateToken = (user: any): string => {
  return jwt.sign({ id: user._id.toString() }, env.jwt_secret, {
    expiresIn: "7d",
  });
};

// Verify JWT token
export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, env.jwt_secret) as { id: string };
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
  const user: any = await User.create({
    name,
    email,
    password,
  });

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
  const user: any = await User.findOne({ email });
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
