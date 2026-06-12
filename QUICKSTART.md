# Quick Start Guide

## Project Setup (5 minutes)

### 1. Frontend Setup

**Windows PowerShell:**
```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
# Edit .env.local to match your backend URL
# For development: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm run dev
```

**macOS/Linux (Bash):**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local to match your backend URL
# For development: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm run dev
```

✓ Frontend runs on **http://localhost:3000**

### 2. Backend Setup

**Windows PowerShell (in another terminal):**
```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edit .env with your Google Cloud credentials:
# - GCP_PROJECT_ID: Your Google Cloud project ID
# - GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON (optional for local dev)
npm run dev
```

**macOS/Linux (Bash):**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Google Cloud credentials:
# - GCP_PROJECT_ID: Your Google Cloud project ID
# - GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON (optional for local dev)
npm run dev
```

✓ Backend runs on **http://localhost:8080**

## Testing the Application

### Via Browser

1. Open **http://localhost:3000** in your browser
2. Click "Get Started" or "Start Finding Benefits"
3. You'll see the chat interface
4. Type a sample user scenario:
   ```
   I'm a college student in California with a family income of $35,000.
   ```
5. The AI assistant will respond with relevant benefits

### Via API

```bash
# Health check
curl http://localhost:8080/health

# Chat endpoint
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am unemployed and need food assistance",
    "conversationHistory": []
  }'

# Get all benefits
curl http://localhost:8080/api/benefits
```

## Troubleshooting

### Frontend Issues

**"Failed to connect to API"**
- Ensure backend is running on port 8080
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Clear browser cache

**Port 3000 already in use (Windows PowerShell):**
```powershell
npm run dev -- -p 3001
```

**Port 3000 already in use (macOS/Linux):**
```bash
npm run dev -- -p 3001
```

### Backend Issues

**Module not found errors (Windows PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Module not found errors (macOS/Linux):**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Cannot find credentials**
- Google Cloud integration requires proper authentication
- For development without Google Cloud, mock services work
- See DEPLOYMENT.md for production setup

## Project Structure

```
Benefits Navigator/
├── frontend/              # Next.js app (localhost:3000)
│   ├── app/
│   │   ├── page.tsx      # Landing page
│   │   ├── chat/
│   │   │   └── page.tsx  # Chat interface
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── package.json
│   └── tsconfig.json
│
├── backend/              # Express API (localhost:8080)
│   ├── src/
│   │   ├── index.ts      # Express server
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── ARCHITECTURE.md   # System design
│   └── DEPLOYMENT.md     # Production deployment
│
├── README.md             # Project overview
└── .github/
    └── copilot-instructions.md
```

## Key Features to Explore

1. **Landing Page** (`/`)
   - Clean hero section
   - Feature highlights
   - CTA button

2. **Chat Interface** (`/chat`)
   - Real-time conversation
   - Benefit recommendations
   - Responsive design

3. **Backend API**
   - Chat endpoint with Vertex AI integration
   - Benefits database retrieval
   - Vector search (placeholder)

## Next Steps

1. ✅ **Setup Complete** - Servers are running
2. 🔧 **Configure Google Cloud** - See DEPLOYMENT.md
3. 📚 **Add Benefits Data** - Load Firestore with benefit programs
4. 🚀 **Deploy to Production** - Deploy to Vercel (frontend) and Cloud Run (backend)

## Common Commands

```bash
# Type checking
npm run type-check

# Building
npm run build

# Running production build
npm start

# Development with hot reload
npm run dev

# Linting (frontend)
npm run lint
```

## Support

- See README.md for full documentation
- Check docs/ARCHITECTURE.md for system design
- Review docs/DEPLOYMENT.md for production setup

---

Happy coding! 🚀
