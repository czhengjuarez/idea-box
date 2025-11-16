# Coscient Instance Setup

## Overview

This branch (`coscient-prod`) is configured for the **public/external** instance at:
**https://idea-box.coscient.workers.dev/**

## Key Differences from Main Branch

### Authentication
- ✅ **Open to all Google accounts** (not restricted to @cloudflare.com)
- ✅ Anyone with a Google account can log in
- ✅ Users can only edit/delete their own ideas
- ✅ Manage page still has full admin access

### Configuration
- `ALLOW_ALL_DOMAINS = true` in `src/auth-config.js`
- Separate Cloudflare account (coscient)
- Separate R2 bucket for data isolation

## Deployment to Coscient Account

### Step 1: Get Coscient Account Credentials

You need the API token for your coscient Cloudflare account:

1. Log into https://dash.cloudflare.com/ with your **coscient account**
2. Go to: My Profile → API Tokens
3. Create or use existing token with permissions:
   - Account: Workers R2 Storage (Edit)
   - Account: Workers Scripts (Edit)
4. Copy the token

### Step 2: Create .env.coscient

Create a separate environment file for coscient:

```bash
# .env.coscient
CLOUDFLARE_API_TOKEN=your_coscient_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_coscient_account_id_here
```

### Step 3: Deploy to Coscient

```bash
# Load coscient credentials
export $(cat .env.coscient | xargs)

# Build and deploy
npm run build
wrangler deploy
```

Or create a deployment script:

```bash
# deploy-coscient.sh
#!/bin/bash
export $(cat .env.coscient | xargs)
npm run build
wrangler deploy
```

Then run:
```bash
chmod +x deploy-coscient.sh
./deploy-coscient.sh
```

## Managing Two Instances

### Branch Strategy

```
main branch          → px-tester account (Cloudflare internal)
  ├─ @cloudflare.com only
  ├─ R2: idea-box (px-tester)
  └─ URL: https://idea-box.px-tester.workers.dev

coscient-prod branch → coscient account (Public)
  ├─ All Google accounts
  ├─ R2: idea-box (coscient)
  └─ URL: https://idea-box.coscient.workers.dev
```

### Deployment Workflow

**For Cloudflare Internal (px-tester):**
```bash
git checkout main
export $(cat .env | xargs)  # Uses px-tester credentials
npm run deploy
```

**For Public/Coscient:**
```bash
git checkout coscient-prod
export $(cat .env.coscient | xargs)  # Uses coscient credentials
npm run deploy
```

### Keeping Branches in Sync

When you make feature updates:

```bash
# Update main branch first
git checkout main
# ... make changes ...
git commit -m "Add new feature"
git push origin main

# Merge to coscient-prod
git checkout coscient-prod
git merge main

# Resolve any conflicts (usually just auth-config.js)
# Keep ALLOW_ALL_DOMAINS = true for coscient
git add .
git commit -m "Merge main features, keep open auth"
git push origin coscient-prod

# Deploy to coscient
export $(cat .env.coscient | xargs)
npm run deploy
```

## Google OAuth Setup

### For Coscient Instance

Add the coscient URL to your Google OAuth Client:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Under "Authorized JavaScript origins", add:
   ```
   https://idea-box.coscient.workers.dev
   ```
4. Save

**Note**: You can use the same Google OAuth Client ID for both instances, or create separate ones.

## Features on Coscient Instance

### What Users Can Do
- ✅ Log in with any Google account (Gmail, G Suite, etc.)
- ✅ Create ideas (automatically owned by their email)
- ✅ Edit their own ideas
- ✅ Delete their own ideas
- ✅ Vote on any idea
- ✅ View all ideas

### What Users Cannot Do
- ❌ Edit other users' ideas (on main page)
- ❌ Delete other users' ideas (on main page)

### Admin Access (Manage Page)
- ✅ Full access to edit/delete any idea
- ✅ See owner email for each idea
- ✅ Create tickets
- ✅ Manage all submissions

## Data Isolation

Each instance has its own R2 bucket:
- **px-tester**: `idea-box` bucket in px-tester account
- **coscient**: `idea-box` bucket in coscient account

Data is completely separate between instances.

## Testing Checklist

After deploying to coscient:

- [ ] Visit https://idea-box.coscient.workers.dev
- [ ] Log in with a non-Cloudflare email (e.g., Gmail)
- [ ] Verify login works
- [ ] Create a test idea
- [ ] Verify you can edit/delete your own idea
- [ ] Log in with different account
- [ ] Verify you CANNOT edit/delete other user's idea
- [ ] Test Manage page access
- [ ] Verify admin can edit/delete any idea

## Troubleshooting

### "Access denied" on login
- Check `ALLOW_ALL_DOMAINS = true` in `src/auth-config.js`
- Rebuild and redeploy

### Wrong Cloudflare account
- Check you're using `.env.coscient` credentials
- Verify `CLOUDFLARE_API_TOKEN` is for coscient account

### Data from wrong instance
- Each account has separate R2 buckets
- Data doesn't cross between accounts

## Quick Reference

### Deploy to px-tester (Cloudflare internal)
```bash
git checkout main
export $(cat .env | xargs)
npm run deploy
```

### Deploy to coscient (Public)
```bash
git checkout coscient-prod
export $(cat .env.coscient | xargs)
npm run deploy
```

### Switch auth config
```javascript
// Cloudflare internal (main branch)
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = ['cloudflare.com']

// Public (coscient-prod branch)
export const ALLOW_ALL_DOMAINS = true
export const ALLOWED_EMAIL_DOMAINS = []
```

## Summary

- ✅ Two separate instances, two separate accounts
- ✅ Coscient: Open to all Google accounts
- ✅ Both: Users can only edit/delete their own ideas
- ✅ Both: Manage page has full admin access
- ✅ Data completely isolated between instances
