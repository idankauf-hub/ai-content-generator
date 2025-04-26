interface GenerationParams {
  topic: string;
  style: string;
  length?: "short" | "medium" | "long";
}

interface GeneratedContent {
  title: string;
  content: string;
}

import { OpenAI } from "openai";
import { AppError } from "../middlewares/error.middleware";

export async function generateContent({
  topic,
  style,
}: GenerationParams): Promise<GeneratedContent> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a blog writer who creates engaging and detailed blog posts in a ${style} style. Format your response as JSON.`,
        },
        {
          role: "user",
          content: `Write a detailed blog post about "${topic}" and format the response as JSON.

            FORMAT YOUR RESPONSE AS JSON LIKE THIS:
            {
            "title": "Your Catchy Title Here",
            "content": "Paragraph 1...\n\nParagraph 2...\n\nParagraph 3..."
            }

            IMPORTANT:
            - The title should be catchy but NOT include the word "Title:" at the beginning
            - Make it engaging, informative, and well-structured
            - Include at least 5 paragraphs`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const generatedText = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(generatedText);

    const cleanTitle = parsed.title.replace(/^Title:\s*["']?|["']$/g, "");

    return {
      title: cleanTitle,
      content: parsed.content,
    };
  } catch (error) {
    throw new AppError(`Failed to generate content`, 500);
  }
}
