#!/bin/bash

set -e  # ← this is the key

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --projectID) PROJECT_ID="$2"; shift ;;
    --serviceName) SERVICE_NAME="$2"; shift ;;
    --repository) REPO_NAME="$2"; shift ;;
    --region) REGION="$2"; shift ;;
    --filepath) DOCKERFILE_PATH="$2"; shift ;;
  esac
  shift
done


IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME:latest"


# Step 1: Authenticate (optional if already logged in)
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo "✅ Already logged in to gcloud."
else
  gcloud auth login
fi

# Step 2: Build Docker image
echo "Building Docker image..."
echo "Using image name: $IMAGE_NAME"

while [ ! -f "README.md" ] && [ "$PWD" != "/" ]; do
  cd ..
done

echo "Now at project root: $PWD"
docker build -f "$DOCKERFILE_PATH" -t "$IMAGE_NAME" .


# # Step 3: Push Docker image to GCR
echo "Pushing image to Container Registry..."
docker push $IMAGE_NAME

# # Step 4: Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_NAME \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated

echo "✅ Deployment complete!"
