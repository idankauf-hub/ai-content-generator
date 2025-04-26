import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Environment variables with default values
export const env = {
  node_env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  mongodb_uri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/ai-content-generator",
  jwt_secret: process.env.JWT_SECRET || "default_secret_change_this",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  openai_api_key: process.env.OPENAI_API_KEY || "",
  huggingface_api_token: process.env.HUGGINGFACE_API_TOKEN || "", // Added Hugging Face token
  cors_origin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

// Validate required environment variables
export const validateEnv = (): void => {
  const requiredEnvs = ["MONGODB_URI", "JWT_SECRET"];
  const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvs.join(", ")}`
    );
  }
};
