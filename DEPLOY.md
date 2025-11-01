# Deployment Guide

## Setup Credentials

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Cloudflare API token:
   - Get your token from: https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Copy the token and paste it in `.env`

3. The `.env` file is already in `.gitignore` and will not be committed to Git

## Deploy to Cloudflare Workers

### Option 1: Using environment file (Recommended)

```bash
npm run deploy:load-env
```

This will automatically load credentials from `.env` and deploy.

### Option 2: Manual with token

```bash
CLOUDFLARE_API_TOKEN=your_token_here npm run deploy
```

### Option 3: Using wrangler directly

```bash
source .env
wrangler deploy
```

## First Time Setup

If this is your first deployment:

1. **Enable R2** in your Cloudflare Dashboard
   - Go to https://dash.cloudflare.com
   - Click R2 in the sidebar
   - Enable R2 (free tier available)

2. **Create R2 bucket**:
   ```bash
   source .env
   wrangler r2 bucket create idea-box
   ```

3. **Deploy**:
   ```bash
   npm run deploy:load-env
   ```

## Deployment URL

After deployment, your app will be available at:
- **Production**: `https://idea-box.px-tester.workers.dev`

## Updating the App

To deploy changes:

```bash
npm run deploy:load-env
```

This will:
1. Build the React app
2. Upload assets to Workers KV
3. Deploy the worker with R2 bindings
4. Update the live site

## Environment Variables

The `.env` file contains:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token (required)
- `CLOUDFLARE_ACCOUNT_ID` - Your account ID (optional, for reference)

**Never commit `.env` to Git!** It's already in `.gitignore`.

## Troubleshooting

### "Not authenticated" error
- Check that your `.env` file exists and has the correct token
- Run `source .env` before deploying
- Or use `npm run deploy:load-env`

### "R2 not enabled" error
- Enable R2 in your Cloudflare Dashboard first
- Go to https://dash.cloudflare.com → R2

### "Bucket not found" error
- Create the bucket: `wrangler r2 bucket create idea-box`
- Make sure the bucket name in `wrangler.toml` matches

## Security Notes

- ✅ `.env` is in `.gitignore` - credentials won't be committed
- ✅ `.env.example` is safe to commit - it's just a template
- ✅ API token has limited permissions (Workers/Pages only)
- ⚠️ Never share your `.env` file or commit it to Git
- ⚠️ Rotate your API token if it's ever exposed
