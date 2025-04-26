# AI Content Generator Backend

The backend API for the AI Content Generator application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for blog posts
- OpenAI integration for AI-powered content generation
- RESTful API design
- TypeScript for type safety
- MongoDB for data storage
- Error handling and validation
- Rate limiting for API protection

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:3000
   ```
4. Build the TypeScript code:
   ```
   npm run build
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts

- `POST /api/posts/save` - Create a new post (protected)
- `GET /api/posts/user` - Get all posts by current user (protected)
- `GET /api/posts/:id` - Get a single post by ID
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)

### Content Generation

- `POST /api/generate` - Generate AI content (protected)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── index.ts         # Entry point
``` 