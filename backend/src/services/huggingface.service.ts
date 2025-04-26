import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

/* ---------- types ---------- */
interface GenerationParams {
  topic: string;
  style: string;
  length?: "short" | "medium" | "long";
}
interface GeneratedContent {
  title: string;
  content: string;
}

/* ---------- strict schema ---------- */
const postSchema = z.object({
  title: z.string().min(4),
  content: z.string().min(20),
});
const parser = StructuredOutputParser.fromZodSchema(postSchema);

/* ---------- prompt ---------- */
const basePrompt = new PromptTemplate({
  template: `
Write a blog post about "{topic}" in a {style} style.
Target length ≈ {words} words.
Sections:
• catchy title
• introduction
• body
• conclusion

Return ONLY valid JSON that matches:
{schema}

{formatInstructions}
`.trim(),
  inputVariables: ["topic", "style", "words", "schema", "formatInstructions"],
  partialVariables: {
    schema: postSchema.toString(),
    formatInstructions: parser.getFormatInstructions(),
  },
});

/* ---------- model roster ---------- */
const MODELS = [
  { id: "google/flan-t5-base", task: "text2text-generation", max: 400 },
  { id: "bigscience/bloomz-560m", task: "text-generation", max: 512 },
  { id: "google/flan-t5-small", task: "text2text-generation", max: 300 },
] as const;

/* ---------- helper ---------- */
function build({ id, task, max }: (typeof MODELS)[number]) {
  return new HuggingFaceInference({
    // plain model id – no query string here
    model: id,
    apiKey: process.env.HUGGINGFACE_API_TOKEN!,
    maxTokens: max,
    temperature: 0.7,
    task, // "text2text-generation" | "text-generation"
    endpointKwargs: { wait_for_model: true }, // avoids cold-start 503/504
  } as any); // cast shuts up tsc
}
/* ---------- public API ---------- */
export async function generateContent({
  topic,
  style,
  length = "medium",
}: GenerationParams): Promise<GeneratedContent> {
  const words = { short: 300, medium: 600, long: 1200 }[length];
  const prompt = await basePrompt.format({
    topic,
    style,
    words,
    schema: postSchema.toString(),
    formatInstructions: parser.getFormatInstructions(),
  });

  for (const m of MODELS) {
    try {
      console.log(`→ trying ${m.id}`);
      const raw = await build(m).invoke(prompt);
      return parser.parse(raw); // throws if JSON invalid
    } catch (e) {
      console.warn(`${m.id} failed: ${e instanceof Error ? e.message : e}`);
    }
  }
  throw new Error(`All models failed (${MODELS.map((m) => m.id).join(", ")})`);
}
