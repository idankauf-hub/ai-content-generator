import mongoose from "mongoose";
import { IUser } from "../models/user.model";

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

// Interface for user without password
export interface UserWithoutPassword {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for user with password
export type UserWithPassword = IUser & { password: string };

// Type for user with comparePassword method
export type UserWithComparePassword = IUser & {
  comparePassword: (password: string) => Promise<boolean>;
};
