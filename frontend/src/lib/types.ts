import { DefaultSession } from "next-auth";
import { AxiosError } from "axios";

// Extend the session user type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

// Authentication status enum
export enum AuthStatus {
  Loading = "loading",
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated",
}

// Custom error response type for axios errors
export type ApiErrorResponse = {
  message?: string;
};

// Type guard to check if an error is an Axios error
export function isAxiosError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return error instanceof AxiosError;
}

// Export any other common types we need across the app
export interface GenerationParams {
  topic: string;
  style: string;
  length?: "short" | "medium" | "long";
}

// Interface for MongoDB post structure
export interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  published?: boolean;
}
