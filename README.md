# AI Content Generator

An AI-powered web application that allows users to generate, edit, and share blog posts. The application uses OpenAI's API to create high-quality content based on user input.

## Features

✅ Generate AI-powered blog posts based on user input
✅ Edit & save drafts in a simple user dashboard
✅ Share generated content via a public link
✅ Multi-user authentication with JWT
✅ Modern, responsive UI with ShadCN UI components

## Tech Stack

### Frontend
- Next.js (React framework)
- TypeScript
- ShadCN UI components
- Tailwind CSS
- Zustand (state management)
- React Query (API data fetching)
- Next Auth (authentication)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- OpenAI API
- Express Rate Limit

## Project Structure

```
ai-content-generator/
├── frontend/        # Next.js frontend application
├── backend/         # Express API backend
└── README.md        # This file
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key

### Setup

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Register for an account or log in
2. Navigate to the editor page
3. Enter a topic and writing style, then click "Generate Content"
4. Edit the generated content as needed
5. Save your post to your dashboard
6. Share your post using the public link

## License

MIT 