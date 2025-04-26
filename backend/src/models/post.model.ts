import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

// Post interface
export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId | string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Post schema
const postSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for more performant queries
postSchema.index({ title: "text", content: "text" });
postSchema.index({ author: 1, createdAt: -1 });

// Export the model
export default mongoose.model<IPost>("Post", postSchema);
