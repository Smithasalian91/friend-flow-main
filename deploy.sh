#!/bin/bash

set -e

echo "Starting deployment..."

AWS_REGION="us-east-1"
FRONTEND_REPO="222066942386.dkr.ecr.us-east-1.amazonaws.com/flow-main-frontend"
BACKEND_REPO="222066942386.dkr.ecr.us-east-1.amazonaws.com/flow-main-backend"

cd /home/ubuntu/app

# Extract the image tags from imagedefinitions.json
IMAGE_TAG=$(cat imagedefinitions.json | grep -oP '"imageUri":"[^:]+:[^"]+' | head -n1 | cut -d: -f3)

echo "Using image tag: $IMAGE_TAG"

# ECR login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin 222066942386.dkr.ecr.us-east-1.amazonaws.com

# Stop and remove old containers
docker stop frontend || true && docker rm frontend || true
docker stop backend || true && docker rm backend || true

# Pull latest images
docker pull $FRONTEND_REPO:$IMAGE_TAG
docker pull $BACKEND_REPO:$IMAGE_TAG

# Run frontend
docker run -d --name frontend -p 8080:80 $FRONTEND_REPO:$IMAGE_TAG

# Run backend
docker run -d --name backend -p 5000:5000 $BACKEND_REPO:$IMAGE_TAG

echo "Deployment successful!"
