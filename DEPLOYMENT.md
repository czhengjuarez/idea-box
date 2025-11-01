# Cloudflare Pages Deployment Guide

## Prerequisites
- A Cloudflare account (you can use a different account than your usual one)
- Node.js and npm installed

## Step 1: Login to Your Cloudflare Account

First, you need to authenticate Wrangler with your specific Cloudflare account:

```bash
npx wrangler login
```

This will:
1. Open a browser window
2. Ask you to log in to Cloudflare
3. Request permission to access your account
4. Save the authentication token locally

**Important**: If you're already logged in to a different Cloudflare account in Wrangler, you'll need to logout first:

```bash
npx wrangler logout
npx wrangler login
```

## Step 2: Build Your Application

Build the production version of your app:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Step 3: Deploy to Cloudflare Pages

Deploy your application:

```bash
npm run deploy
```

Or manually:

```bash
npx wrangler pages deploy dist
```

On first deployment, Wrangler will:
1. Ask you to name your project (e.g., "idea-box")
2. Create a new Cloudflare Pages project
3. Upload your files
4. Provide you with a URL like: `https://idea-box-xxx.pages.dev`

## Step 4: Access Your Deployed App

After deployment completes, you'll see:
- **Production URL**: `https://your-project-name.pages.dev`
- **Deployment ID**: A unique identifier for this deployment

## Managing Multiple Cloudflare Accounts

### Method 1: Using Different Profiles (Recommended)

You can use environment variables to manage different accounts:

```bash
# Set a specific API token for this project
export CLOUDFLARE_API_TOKEN=your_token_here
npm run deploy
```

### Method 2: Manual Token Management

1. Get your API token from Cloudflare Dashboard:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create a token with "Cloudflare Pages" permissions
   
2. Use the token directly:
```bash
CLOUDFLARE_API_TOKEN=your_token npx wrangler pages deploy dist
```

### Method 3: Switch Accounts

```bash
# Logout from current account
npx wrangler logout

# Login to different account
npx wrangler login
```

## Subsequent Deployments

After the initial setup, deploying updates is simple:

```bash
npm run deploy
```

This will:
1. Build your latest changes
2. Deploy to the same Cloudflare Pages project
3. Automatically update your live site

## Custom Domain (Optional)

To add a custom domain:

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your "idea-box" project
4. Go to "Custom domains"
5. Add your domain

## Environment Variables

If you need to add environment variables (for future features):

1. Go to your project in Cloudflare Dashboard
2. Settings → Environment variables
3. Add variables for Production and/or Preview

## Troubleshooting

### "Not logged in" error
Run: `npx wrangler login`

### "Project already exists" error
The project name is taken. Choose a different name when prompted.

### Build errors
Make sure to run `npm install` and `npm run build` successfully before deploying.

### Wrong account
Run `npx wrangler logout` then `npx wrangler login` to switch accounts.

## Useful Commands

```bash
# Check which account you're logged in as
npx wrangler whoami

# List your Cloudflare Pages projects
npx wrangler pages project list

# View deployment logs
npx wrangler pages deployment list

# Logout
npx wrangler logout
```

## Next Steps

After deployment:
1. Share the URL with your team
2. Consider setting up a custom domain
3. Enable analytics in Cloudflare Dashboard
4. Set up automatic deployments via Git (optional)

## Git Integration (Optional)

For automatic deployments on every push:

1. Push your code to GitHub/GitLab
2. In Cloudflare Dashboard → Workers & Pages
3. Click "Create application" → "Pages" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

Now every push to your main branch will automatically deploy!
