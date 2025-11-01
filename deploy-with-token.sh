#!/bin/bash

# Cloudflare Pages Deployment Script with API Token
# This script helps you deploy using an API token instead of OAuth login

echo "🚀 Cloudflare Pages Deployment"
echo "================================"
echo ""
echo "Before running this script, get your API token:"
echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
echo "2. Click 'Create Token'"
echo "3. Use 'Edit Cloudflare Workers' template"
echo "4. Copy the token"
echo ""
echo "Then run this script with:"
echo "  CLOUDFLARE_API_TOKEN=your_token_here ./deploy-with-token.sh"
echo ""

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set"
    echo ""
    echo "Usage:"
    echo "  CLOUDFLARE_API_TOKEN=your_token_here ./deploy-with-token.sh"
    echo ""
    exit 1
fi

echo "✅ API Token detected"
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "🚀 Deploying to Cloudflare Pages..."
    npx wrangler pages deploy dist --project-name=idea-box
else
    echo "❌ Build failed"
    exit 1
fi
