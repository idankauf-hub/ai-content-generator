import { Request, Response, NextFunction } from "express";

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default values
  let statusCode = 500;
  let message = "Something went wrong";
  let stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  // If it's our custom error, use its values
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    // Mongoose cast error (e.g., invalid ObjectId)
    statusCode = 400;
    message = "Resource not found";
  } else if (err.name === "JsonWebTokenError") {
    // JWT validation error
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    // JWT expired error
    statusCode = 401;
    message = "Token expired";
  }

  // Log error for server-side issues
  if (statusCode >= 500) {
    console.error(`Server Error: ${err.message}`, err);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    stack,
  });
};
