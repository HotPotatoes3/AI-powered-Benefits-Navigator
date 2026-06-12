# Deployment Guide

## Prerequisites

- Google Cloud Project with billing enabled
- gcloud CLI installed
- Vercel account (for frontend)
- Firebase/Firestore database

## Google Cloud Setup

### 1. Create a Service Account

```bash
gcloud iam service-accounts create benefits-navigator \
  --display-name="Benefits Navigator Service Account"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:benefits-navigator@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/aiplatform.user

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:benefits-navigator@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/datastore.user

gcloud iam service-accounts keys create credentials.json \
  --iam-account=benefits-navigator@PROJECT_ID.iam.gserviceaccount.com
```

### 2. Enable Required APIs

```bash
gcloud services enable vertexai.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Create Firestore Database

```bash
gcloud firestore databases create --region=us-central1
```

## Backend Deployment (Cloud Run)

### 1. Build Docker Image

```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/benefits-navigator-api
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy benefits-navigator-api \
  --image gcr.io/PROJECT_ID/benefits-navigator-api \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=PROJECT_ID,FIRESTORE_DATABASE=benefits-navigator,VERTEX_AI_REGION=us-central1,CORS_ORIGIN=https://your-frontend-url.vercel.app
```

Get the service URL from the output and use it for frontend API_BASE_URL.

## Frontend Deployment (Vercel)

### 1. Connect Repository

```bash
cd frontend
vercel
```

Follow prompts to link to your GitHub repository.

### 2. Set Environment Variables

In Vercel Dashboard:
- `NEXT_PUBLIC_API_BASE_URL` = Cloud Run service URL

### 3. Deploy

```bash
vercel --prod
```

## Firestore Setup

### 1. Add Benefits Collection

Create a `benefits` collection in Firestore with documents like:

```json
{
  "name": "SNAP",
  "description": "Supplemental Nutrition Assistance Program",
  "eligibility": "Low-income individuals and families",
  "state": "all",
  "website": "https://www.fns.usda.gov/snap",
  "keywords": ["food", "nutrition", "assistance", "low-income"],
  "benefits": "Up to $250/month for groceries"
}
```

### 2. Create Vector Index (Optional)

For semantic search, create vector embeddings:

```bash
gcloud aiplatform indexes create \
  --display-name=benefit-documents-index \
  --contents-delta-uri=gs://YOUR_BUCKET/benefit-embeddings \
  --region=us-central1
```

## Monitoring

### Backend Logs
```bash
gcloud run logs read benefits-navigator-api --region us-central1
```

### Firestore Monitoring
- Check Firestore Dashboard in Google Cloud Console
- Monitor read/write operations

## Troubleshooting

### CORS Issues
Ensure `CORS_ORIGIN` environment variable matches your frontend URL.

### Vertex AI Errors
Verify API is enabled and service account has proper permissions.

### Firestore Connection Issues
Check:
- Firestore database is created
- Service account has datastore.user role
- GOOGLE_APPLICATION_CREDENTIALS path is correct

## Scaling

- **Firestore**: Use indexes for frequently queried fields
- **Cloud Run**: Increase memory/CPU in service configuration
- **Vector Search**: Consider Pinecone or Milvus for larger datasets
