import { OpenAI } from "openai";
import { env } from "../config/environment";

interface GenerationParams {
  topic: string;
  style: string;
  length?: "short" | "medium" | "long";
}

interface GeneratedContent {
  title: string;
  content: string;
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: env.openai_api_key,
});

// Generate content with OpenAI
export const generateContent = async (
  params: GenerationParams
): Promise<GeneratedContent> => {
  const { topic, style, length = "medium" } = params;

  // Define length in words
  const wordCount = {
    short: 300,
    medium: 600,
    long: 1200,
  };

  const prompt = `
    Write a blog post about "${topic}" in a ${style} style.
    The post should be approximately ${wordCount[length]} words.
    Structure it with a catchy title, introduction, body with relevant sections, and conclusion.
    Format the content with paragraphs for easy readability.
    The response should be formatted as a JSON object with "title" and "content" fields.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional writer creating high-quality blog posts. Your output should be well-structured, engaging, and informative.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Failed to generate content: No response from API");
    }

    // Parse the JSON response
    try {
      const parsedContent = JSON.parse(responseContent) as GeneratedContent;
      return parsedContent;
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON", responseContent);
      // Fallback: If JSON parsing fails, try to extract title and content manually
      const title = topic; // Use the topic as a fallback title
      return {
        title,
        content: responseContent,
      };
    }
  } catch (error: any) {
    console.error("Error generating content with OpenAI:", error.message);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};
