#!/bin/bash

# Deploy to Coscient Account
# This script deploys the coscient-prod branch to the coscient Cloudflare account

set -e  # Exit on error

echo "🚀 Deploying to Coscient Account..."
echo ""

# Check if .env.coscient exists
if [ ! -f .env.coscient ]; then
    echo "❌ Error: .env.coscient file not found!"
    echo ""
    echo "Please create .env.coscient with your coscient account credentials:"
    echo "  cp .env.coscient.example .env.coscient"
    echo "  # Then edit .env.coscient with your actual values"
    exit 1
fi

# Check if on correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "coscient-prod" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'coscient-prod'"
    echo ""
    read -p "Switch to coscient-prod branch? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout coscient-prod
    else
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Load coscient credentials
echo "📋 Loading coscient account credentials..."
export $(cat .env.coscient | grep -v '^#' | xargs)

# Build
echo "🔨 Building production bundle..."
npm run build

# Deploy
echo "☁️  Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://idea-box.coscient.workers.dev"
echo ""
echo "📝 Next steps:"
echo "  1. Add https://idea-box.coscient.workers.dev to Google OAuth authorized origins"
echo "  2. Test login with any Google account"
echo "  3. Verify ownership restrictions work"
