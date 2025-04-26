import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { env, validateEnv } from "./config/environment";
import { connectDB } from "./config/database";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middlewares/error.middleware";

// Import routes
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import generateRoutes from "./routes/generate.routes";

// Validate environment variables
validateEnv();

// Create Express app
const app: Express = express();

// Connect to MongoDB and Redis
connectDB();
// connectRedis();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.cors_origin, credentials: true }));
app.use(helmet());
app.use(morgan(env.node_env === "development" ? "dev" : "combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/generate", generateRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`Server running in ${env.node_env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
