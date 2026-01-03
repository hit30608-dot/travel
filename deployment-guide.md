
# KyotoTrip Deployment Guide (GCP Cloud Run)

### 1. Initial Setup
Ensure you have the Google Cloud SDK installed and authenticated.

```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### 2. Enable Required APIs
```bash
gcloud services enable run.googleapis.com \
                       containerregistry.googleapis.com \
                       firestore.googleapis.com \
                       translate.googleapis.com
```

### 3. Build and Push Container
Replace `[PROJECT_ID]` with your actual project ID.

```bash
# Build using Cloud Build
gcloud builds submit --tag gcr.io/[PROJECT_ID]/kyoto-trip
```

### 4. Deploy to Cloud Run
```bash
gcloud run deploy kyoto-trip \
  --image gcr.io/[PROJECT_ID]/kyoto-trip \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=[YOUR_GEMINI_API_KEY]
```

### 5. Database Setup
Go to the GCP Console and ensure Firestore is in "Native Mode". The Spring Boot app will automatically use the default Firestore instance.

---
**Note:** For the AI features, ensure the Cloud Run service account has the "Cloud Translation API User" role assigned.
