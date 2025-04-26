import mongoose from "mongoose";
import { env } from "./environment";

export const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.mongodb_uri);
    console.log(`MongoDB Connected`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
