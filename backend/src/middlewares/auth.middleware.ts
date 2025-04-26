import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";
import { TokenPayload } from "../types/auth.types";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Middleware to protect routes that require authentication
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    // Get token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Add user to request
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
    return;
  }
};

export const publicRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // If token exists, verify it and attach user info (but don't require it)
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token is invalid, but we won't block the request
        console.log("Invalid token provided for public route");
      }
    }

    next();
  } catch (error) {
    next();
  }
};
