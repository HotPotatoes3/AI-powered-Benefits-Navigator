# AI-powered Benefits Navigator

An AI-powered web application that helps users discover government and community benefits they may qualify for through a conversational interface.

## Architecture

```
Frontend (React / Next.js)
          |
          v
API Layer (Cloud Run)
          |
          +----------------+
          |                |
          v                v
    Vertex AI Gemini   Firestore
          |
          v
Vector Search
(benefit documents)
```

## Project Structure

```
.
├── frontend/          # Next.js React application
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/           # Express API for Cloud Run
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── docs/              # Documentation
└── README.md
```

## Features

- **Landing Page**: Introduction and call-to-action
- **Chat Interface**: Conversational AI assistant for benefits discovery
- **Smart Recommendations**: AI-powered benefit matching based on user input
- **Google Cloud Integration**: Vertex AI Gemini for conversational AI
- **Vector Search**: Semantic search over benefit documents
- **Secure & Private**: All user data is confidential

## Tech Stack

### Frontend
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Express.js
- TypeScript
- Google Cloud Vertex AI
- Firestore
- Firebase Admin SDK

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud Project with:
  - Vertex AI API enabled
  - Firestore enabled
  - Service account credentials

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with your API URL
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your Google Cloud credentials
npm run dev
```

Backend runs on `http://localhost:8080`

## API Endpoints

### POST /api/chat
Send a message to the benefits advisor AI.

**Request:**
```json
{
  "message": "I'm a college student in California with family income of 35k",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "message": "Based on your situation...",
  "benefits": [...]
}
```

### GET /api/benefits
Get all available benefits.

### GET /api/benefits/:id
Get a specific benefit by ID.

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

### Backend (.env)
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment (development/production)
- `GCP_PROJECT_ID` - Google Cloud Project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON
- `FIRESTORE_DATABASE` - Firestore database name
- `VERTEX_AI_REGION` - GCP region for Vertex AI
- `CORS_ORIGIN` - Frontend URL for CORS

## Development

### Type Checking
```bash
# Frontend
cd frontend && npm run type-check

# Backend
cd backend && npm run type-check
```

### Building
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Google Cloud Run)
```bash
cd backend
npm run build
gcloud run deploy benefits-navigator-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues or questions, please create a GitHub issue.
