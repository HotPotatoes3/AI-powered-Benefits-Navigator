# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐                       │
│  │    Next.js Frontend (Vercel)        │                       │
│  │  ┌─────────────────────────────────┐│                       │
│  │  │  Landing Page                   ││                       │
│  │  │  - Hero section                 ││                       │
│  │  │  - Feature cards                ││                       │
│  │  │  - CTA buttons                  ││                       │
│  │  └─────────────────────────────────┘│                       │
│  │  ┌─────────────────────────────────┐│                       │
│  │  │  Chat Interface                 ││                       │
│  │  │  - Message display              ││                       │
│  │  │  - User input                   ││                       │
│  │  │  - Benefit recommendations      ││                       │
│  │  └─────────────────────────────────┘│                       │
│  │                                     │                       │
│  │  React Hooks + Axios               │                       │
│  └─────────────────────────────────────┘                       │
│                    ↕ HTTP/REST                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Google Cloud Run (Backend API)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐                       │
│  │    Express.js Server                │                       │
│  │  ┌─────────────────────────────────┐│                       │
│  │  │  Routes                         ││                       │
│  │  │  - POST /api/chat               ││                       │
│  │  │  - GET /api/benefits            ││                       │
│  │  │  - GET /api/benefits/:id        ││                       │
│  │  └─────────────────────────────────┘│                       │
│  │  ┌─────────────────────────────────┐│                       │
│  │  │  Middleware                     ││                       │
│  │  │  - CORS                         ││                       │
│  │  │  - JSON parsing                 ││                       │
│  │  │  - Error handling               ││                       │
│  │  └─────────────────────────────────┘│                       │
│  └─────────────────────────────────────┘                       │
│           ↓              ↓                                       │
│      Vertex AI       Firestore         Vector Search            │
│      Gemini          Benefits DB       (Future: Pinecone)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (Next.js)

**Landing Page** (`/`)
- Hero section with value proposition
- Feature cards highlighting benefits
- Call-to-action button to chat interface
- Responsive design with Tailwind CSS

**Chat Interface** (`/chat`)
- Real-time message display
- User message input form
- Typing indicator
- Benefit recommendations display
- Smooth scrolling

**Components**
- Reusable UI components
- Custom hooks for API integration
- Responsive layouts

### Backend (Express)

**Routes**
- `/api/chat` - Main conversational endpoint
- `/api/benefits` - Benefits database endpoints
- `/health` - Health check for monitoring

**Services**
- `GeminiService` - Handles Vertex AI Gemini API calls
- `FirestoreService` - Handles Firestore database operations
- `VectorSearchService` - Handles semantic search (mockup for now)

**Middleware**
- CORS handling
- Error handling
- Request/response formatting

### Database (Firestore)

**Collections**
- `benefits` - Benefit programs and eligibility info
- `users` (optional) - User profiles and preferences
- `conversations` (optional) - Chat history

**Benefits Document Structure**
```javascript
{
  name: string,
  description: string,
  eligibility: string,
  state: string,
  website: string,
  applicationProcess: string,
  benefits: string,
  keywords: string[],
  vectors: number[] // Embedding vectors for semantic search
}
```

### AI Services (Vertex AI)

**Gemini API**
- Conversational AI for benefits discovery
- Context-aware responses
- Multi-turn conversation support
- Benefit extraction and ranking

**Vector Search** (Future Enhancement)
- Semantic search over benefit documents
- Embedding generation for user queries
- Similarity matching for relevant benefits

## Data Flow

### Chat Flow
```
User Input
    ↓
POST /api/chat
    ↓
GeminiService.generateResponse()
    ├→ VectorSearchService.searchBenefits() [Get context]
    ├→ Vertex AI Gemini API [Generate response]
    └→ Extract benefits from response
    ↓
Return message + benefits
    ↓
Frontend renders response
```

### Benefits Recommendation Flow
```
User Message
    ↓
Keyword extraction
    ↓
Vector search for similar benefits
    ↓
Context-enhanced prompt to Gemini
    ↓
Gemini generates personalized recommendations
    ↓
Benefits ranked by relevance
    ↓
Display to user
```

## Security Considerations

- Service account credentials stored securely
- CORS restrictions to prevent unauthorized access
- Environment variables for sensitive data
- Firestore security rules (to be configured)
- HTTPS only in production

## Scalability

- Cloud Run auto-scales based on demand
- Firestore handles growing data
- Vector search can be upgraded to managed service
- Frontend CDN via Vercel

## Future Enhancements

1. **Advanced Vector Search**
   - Pinecone or Milvus integration
   - Multi-modal embeddings
   - Hybrid search (keyword + semantic)

2. **User Personalization**
   - User profiles and preferences
   - Conversation history
   - Bookmarked benefits

3. **Analytics**
   - Track user journeys
   - Monitor benefit discovery success
   - A/B testing for UI improvements

4. **Multi-language Support**
   - Localization for different languages
   - Multi-region deployment

5. **Mobile App**
   - React Native or Flutter
   - Offline support
