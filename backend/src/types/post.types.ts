import mongoose from "mongoose";

// Interface for MongoDB post structure
export interface MongoDBPost {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string | mongoose.Types.ObjectId;
  published?: boolean;
}
