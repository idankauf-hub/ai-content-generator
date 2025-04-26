import "dotenv/config"; // ↖ loads .env automatically
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/database";
import { env, validateEnv } from "./config/environment";
import { errorHandler } from "./middlewares/error.middleware";

// ─── Routes ────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.routes";
import generateRoutes from "./routes/generate.routes";
import postRoutes from "./routes/post.routes";

// ─── Env & DB ──────────────────────────────────────────────────────────
validateEnv();
connectDB();
// connectRedis();          // enable when Redis is ready

// ─── Express ───────────────────────────────────────────────────────────
const app: Express = express();

// ─── CORS ──────────────────────────────────────────────────────────────
const whitelist = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

console.log("CORS whitelist:", whitelist);

const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / SSR
    return whitelist.includes(origin)
      ? cb(null, true)
      : cb(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200, // for legacy browsers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // pre-flight for every route

// ─── Security / Logs ───────────────────────────────────────────────────
app.use(helmet());
app.use(morgan(env.node_env === "development" ? "dev" : "combined"));

// ─── Body parsers ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate limiting ─────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later",
  })
);

// ─── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/generate", generateRoutes);

app.get("/api/health", (_, res) =>
  res.status(200).json({ status: "ok", message: "Server is running" })
);

// 404 handler
app.use((_, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler
app.use(errorHandler);

// ─── Server ────────────────────────────────────────────────────────────
const PORT = env.port;
app.listen(PORT, () =>
  console.log(`Server running in ${env.node_env} mode on port ${PORT}`)
);

// ─── Process-level guards ──────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
