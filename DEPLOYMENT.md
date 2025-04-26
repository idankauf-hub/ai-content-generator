# AI Content Generator - Deployment Guide

This guide explains how to deploy the AI Content Generator application, consisting of a Next.js frontend and Express.js backend.

## Prerequisites

- Docker and Docker Compose (for local deployment and testing)
- Vercel account (for backend deployment)
- Render account (for frontend deployment)
- MongoDB Atlas account (for production database)
- Redis Cloud account (or any Redis provider)

## Local Development with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-content-generator
   ```

2. Create a `.env` file in the root directory with necessary environment variables:
   ```
   MONGO_URI=mongodb://mongo:27017/ai-content-generator
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=redis://redis:6379
   ```

3. Build and start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api

## Production Deployment

### Backend (Vercel)

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Go to [Vercel](https://vercel.com) and import your project

3. Configure the following environment variables:
   - `NODE_ENV=production`
   - `PORT=4000` (Note: Vercel will override this with its own port)
   - `MONGODB_URI=<your_mongodb_atlas_uri>`
   - `JWT_SECRET=<your_production_jwt_secret>`
   - `JWT_EXPIRES_IN=7d`
   - `OPENAI_API_KEY=<your_openai_api_key>`
   - `CORS_ORIGIN=https://your-frontend-url.onrender.com`
   - `REDIS_URL=<your_redis_cloud_url>`

4. Deploy the project

5. Note the deployed URL (e.g., https://ai-content-generator-backend.vercel.app)

### Frontend (Render)

1. Push your code to a Git repository

2. Go to [Render](https://render.com) and create a new Web Service

3. Select your repository and choose the following settings:
   - Name: ai-content-generator-frontend
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

4. Add the following environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `NEXT_PUBLIC_API_URL=https://ai-content-generator-backend.vercel.app/api`

5. Deploy the service

6. Access your deployed frontend at the provided Render URL

## Scaling and Performance

### Auto-scaling

- **Vercel Backend**: Automatically scales based on demand with serverless functions
- **Render Frontend**: Configure auto-scaling in the Render dashboard under the "Scaling" section

### Redis Caching

Redis is already integrated into the application for caching API responses. Make sure you:

1. Use a production Redis instance like Redis Cloud for production deployments
2. Monitor cache hit rates and adjust TTL settings as needed
3. Consider implementing cache invalidation strategies for frequently updated data

### Additional Performance Optimizations

- Enable Cloudflare CDN for frontend caching
- Use MongoDB Atlas indexes for commonly queried fields
- Implement pagination for large data sets
- Consider using edge functions for globally distributed API endpoints

## Monitoring

- Set up logging with a service like Datadog or Sentry
- Configure alerts for critical errors or performance issues
- Regularly review application metrics and scale resources accordingly 