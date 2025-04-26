import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as NextAuthUser } from "next-auth";

// Extend the NextAuth User type
interface UserWithToken extends NextAuthUser {
  token?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use the custom backend API endpoint
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            console.error("Login failed:", response.statusText);
            return null;
          }

          const data = await response.json();
          console.log("Login response:", data);

          // The backend returns an object with user and token
          if (data && data.token) {
            // If response is like { user: {...}, token: "..." }
            if (data.user) {
              return {
                id: data.user.id || data.user._id,
                name: data.user.name,
                email: data.user.email,
                token: data.token,
              };
            }

            // If response is like { id: "...", email: "...", name: "...", token: "..." }
            return {
              id: data.id,
              name: data.name,
              email: data.email,
              token: data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cast to our extended user type
        const userWithToken = user as UserWithToken;
        token.accessToken = userWithToken.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};
