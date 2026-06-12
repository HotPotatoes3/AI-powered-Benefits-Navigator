# Copilot Instructions for Benefits Navigator

This document provides guidance for AI assistants working on the AI-powered Benefits Navigator project.

## Project Overview

Full-stack application consisting of:
- **Frontend**: Next.js React app with landing page and chat interface
- **Backend**: Express API with Vertex AI Gemini integration
- **Database**: Firestore for benefits data
- **Search**: Vector search for semantic querying of benefit documents

## Architecture Guidelines

### Frontend
- Use Next.js 14+ with TypeScript
- Style with Tailwind CSS
- Maintain component-based structure in `app/components/`
- Keep pages in `app/pages/` or as route segments
- Use React hooks for state management

### Backend
- Express.js server with TypeScript
- Organize code by routes → services pattern
- Services communicate with external APIs (Vertex AI, Firestore)
- Middleware for error handling and CORS

### Database
- Firestore for persistent storage
- Collections: `benefits`, `users`, `conversations`
- Implement proper indexing for vector search

## Development Workflow

1. **Setup**: Install dependencies for frontend and backend separately
2. **Development**: Run both servers concurrently (frontend on 3000, backend on 8080)
3. **Testing**: Test API endpoints via the frontend chat interface
4. **Deployment**: Frontend to Vercel, backend to Cloud Run

## Key Files

- `frontend/app/page.tsx` - Landing page
- `frontend/app/chat/page.tsx` - Chat interface
- `backend/src/index.ts` - Express app entry
- `backend/src/services/gemini.ts` - Vertex AI integration
- `backend/src/services/firestore.ts` - Firestore operations

## Important Notes

- Always include proper TypeScript types
- Use environment variables for configuration
- Implement error handling in all API routes
- Keep frontend and backend API contracts consistent
- Maintain security by never exposing sensitive keys

## Getting Help

Refer to the README.md for setup and deployment instructions.
