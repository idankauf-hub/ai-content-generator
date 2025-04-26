import { Request, Response } from "express";
import { generateContent } from "../services/openai.service";
import { AppError } from "../middlewares/error.middleware";

export const generateAIContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topic, style } = req.body;

    if (!topic || !style) {
      throw new AppError("Please provide topic and style", 400);
    }

    const content = await generateContent({ topic, style });
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    if (error.message.includes("Failed to generate content")) {
      res.status(500).json({
        success: false,
        message: "Failed to generate content. Please try again.",
      });
      return;
    }

    throw error;
  }
};
