# R2 Storage Setup Guide

Your Idea Box is now configured to use Cloudflare R2 for persistent storage instead of localStorage. This means all users will share the same data!

## Step 1: Enable R2 in Your Cloudflare Account

1. Go to https://dash.cloudflare.com
2. Click on **R2** in the left sidebar
3. Click **"Purchase R2"** or **"Enable R2"**
   - R2 has a generous free tier: 10 GB storage, 1 million Class A operations, 10 million Class B operations per month
   - No credit card required for free tier
4. Accept the terms and enable R2

## Step 2: Create the R2 Bucket

Once R2 is enabled, create the bucket:

```bash
CLOUDFLARE_API_TOKEN=GoP_DVEPq4fB8ZiY-rYb2zO68LPCmShi3rUmwNKi npx wrangler r2 bucket create idea-box-data
```

Or create it manually in the dashboard:
1. Go to R2 in your Cloudflare Dashboard
2. Click "Create bucket"
3. Name it: `idea-box-data`
4. Click "Create bucket"

## Step 3: Deploy the Updated Worker

After the bucket is created, deploy:

```bash
CLOUDFLARE_API_TOKEN=GoP_DVEPq4fB8ZiY-rYb2zO68LPCmShi3rUmwNKi npm run deploy
```

## How It Works

### API Endpoints

The worker now provides these endpoints:

- **GET /api/ideas** - Retrieves all ideas from R2
- **POST /api/ideas** - Saves ideas to R2

### Data Storage

- Ideas are stored as JSON in R2: `ideas.json`
- All users share the same data
- Data persists across deployments
- Automatic backups via R2

### Benefits Over localStorage

✅ **Shared data** - All team members see the same ideas  
✅ **Persistent** - Data survives browser clears  
✅ **Scalable** - Can handle large amounts of data  
✅ **Backed up** - R2 provides durability  

## Testing Locally

To test with R2 locally, you'll need to:

1. Create a `.dev.vars` file (gitignored) with your API token
2. Run: `npx wrangler dev`

## Troubleshooting

### "R2 not enabled" error
- Enable R2 in your Cloudflare Dashboard first

### "Bucket not found" error
- Make sure the bucket name in `wrangler.toml` matches the created bucket
- Bucket name: `idea-box-data`

### API errors in browser console
- Check that the worker deployed successfully
- Verify R2 bucket exists
- Check browser network tab for error details

## R2 Pricing (Free Tier)

- **Storage**: 10 GB free per month
- **Class A operations** (writes): 1 million free per month
- **Class B operations** (reads): 10 million free per month

For a small team idea box, you'll likely stay well within the free tier!
