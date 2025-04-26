import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../services/auth.service";

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
