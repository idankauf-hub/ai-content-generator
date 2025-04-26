import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { AppError } from "../middlewares/error.middleware";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Please provide name, email and password", 400);
    }

    const user = await registerUser(name, email, password);

    // Send response
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    throw error;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    const authResponse = await loginUser(email, password);

    res.status(200).json({
      id: authResponse.id,
      name: authResponse.name,
      email: authResponse.email,
      token: authResponse.token,
    });
  } catch (error: any) {
    // Handle invalid credentials error
    if (error.message.includes("Invalid email or password")) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    throw error;
  }
};

// Get current user
export const getCurrentUser = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};
