import { Request, Response } from "express";
import { generateContent } from "../services/openai.service";
import { AppError } from "../middlewares/error.middleware";

// Generate AI content
export const generateAIContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topic, style, length } = req.body;

    // Validate input
    if (!topic || !style) {
      throw new AppError("Please provide topic and style", 400);
    }

    // Generate content
    const content = await generateContent({ topic, style, length });

    // Send response
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    // Handle OpenAI errors
    if (error.message.includes("Failed to generate content")) {
      res.status(500).json({
        success: false,
        message: "Failed to generate content. Please try again.",
      });
      return;
    }

    // Pass other errors to the error handler
    throw error;
  }
};
