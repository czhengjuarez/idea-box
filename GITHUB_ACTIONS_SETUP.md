# GitHub Actions Auto-Deployment Setup

## Overview

Automatic deployment is configured for both instances:
- **`main` branch** → Auto-deploys to px-tester account
- **`coscient-prod` branch** → Auto-deploys to coscient account

## Setup GitHub Secrets

You need to add Cloudflare credentials as GitHub Secrets.

### Step 1: Go to GitHub Repository Settings

1. Go to: https://github.com/czhengjuarez/idea-box
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

### Step 2: Add Coscient Account Secrets

Add these two secrets for the coscient account:

#### Secret 1: `COSCIENT_CLOUDFLARE_API_TOKEN`
- **Name**: `COSCIENT_CLOUDFLARE_API_TOKEN`
- **Value**: Your coscient Cloudflare API token
  - Get from: https://dash.cloudflare.com/profile/api-tokens (logged into coscient account)
  - Or use the value from your `.env.coscient` file

#### Secret 2: `COSCIENT_CLOUDFLARE_ACCOUNT_ID`
- **Name**: `COSCIENT_CLOUDFLARE_ACCOUNT_ID`
- **Value**: Your coscient Cloudflare Account ID
  - Get from: https://dash.cloudflare.com/ (in the URL or sidebar, logged into coscient account)
  - Or use the value from your `.env.coscient` file

### Step 3: Add PX-Tester Account Secrets

Add these two secrets for the px-tester account:

#### Secret 3: `PX_TESTER_CLOUDFLARE_API_TOKEN`
- **Name**: `PX_TESTER_CLOUDFLARE_API_TOKEN`
- **Value**: Your px-tester Cloudflare API token
  - From your `.env` file: `GoP_DVEPq4fB8ZiY-rYb2zO68LPCmShi3rUmwNKi`

#### Secret 4: `PX_TESTER_CLOUDFLARE_ACCOUNT_ID`
- **Name**: `PX_TESTER_CLOUDFLARE_ACCOUNT_ID`
- **Value**: Your px-tester Cloudflare Account ID
  - From your `.env` file: `49117820acd5ccaea75d0736a41b51da`

## How It Works

### Automatic Deployment Triggers

**When you push to `main` branch:**
```bash
git checkout main
git add .
git commit -m "Update feature"
git push origin main
```
→ GitHub Actions automatically deploys to **px-tester** account
→ Live at: https://idea-box.px-tester.workers.dev

**When you push to `coscient-prod` branch:**
```bash
git checkout coscient-prod
git add .
git commit -m "Update feature"
git push origin coscient-prod
```
→ GitHub Actions automatically deploys to **coscient** account
→ Live at: https://idea-box.coscient.workers.dev

### Workflow Files

- `.github/workflows/deploy-px-tester.yml` - Deploys main branch
- `.github/workflows/deploy-coscient.yml` - Deploys coscient-prod branch

### Viewing Deployment Status

1. Go to: https://github.com/czhengjuarez/idea-box/actions
2. You'll see deployment runs for each push
3. Click on a run to see logs and status

## Testing the Setup

### Test Coscient Deployment

1. Make a small change on `coscient-prod` branch:
   ```bash
   git checkout coscient-prod
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test auto-deploy"
   git push origin coscient-prod
   ```

2. Watch the deployment:
   - Go to: https://github.com/czhengjuarez/idea-box/actions
   - You should see "Deploy to Coscient" workflow running
   - Wait for it to complete (green checkmark)

3. Verify:
   - Visit: https://idea-box.coscient.workers.dev
   - Changes should be live

### Test PX-Tester Deployment

1. Make a small change on `main` branch:
   ```bash
   git checkout main
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test auto-deploy"
   git push origin main
   ```

2. Watch the deployment:
   - Go to: https://github.com/czhengjuarez/idea-box/actions
   - You should see "Deploy to PX-Tester" workflow running

3. Verify:
   - Visit: https://idea-box.px-tester.workers.dev
   - Changes should be live

## Workflow Details

### What Happens on Each Push

1. **Checkout code** - Gets the latest code from the branch
2. **Setup Node.js** - Installs Node.js 20
3. **Install dependencies** - Runs `npm ci`
4. **Build** - Runs `npm run build`
5. **Deploy** - Uses Wrangler to deploy to Cloudflare Workers

### Build Time

Typical deployment takes **2-3 minutes**:
- Checkout: ~5 seconds
- Setup Node: ~10 seconds
- Install deps: ~30 seconds
- Build: ~5 seconds
- Deploy: ~30 seconds

## Troubleshooting

### Deployment Fails with "Authentication error"

**Problem**: GitHub Secrets not set correctly

**Solution**:
1. Go to: https://github.com/czhengjuarez/idea-box/settings/secrets/actions
2. Verify all 4 secrets are present:
   - `COSCIENT_CLOUDFLARE_API_TOKEN`
   - `COSCIENT_CLOUDFLARE_ACCOUNT_ID`
   - `PX_TESTER_CLOUDFLARE_API_TOKEN`
   - `PX_TESTER_CLOUDFLARE_ACCOUNT_ID`
3. Check the values match your `.env` files

### Deployment Succeeds but Changes Not Visible

**Problem**: Browser cache or Cloudflare cache

**Solution**:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Wait 1-2 minutes for Cloudflare edge cache to update

### Wrong Account Deployed To

**Problem**: Secrets mixed up

**Solution**:
- Verify `COSCIENT_*` secrets are for coscient account
- Verify `PX_TESTER_*` secrets are for px-tester account
- Check deployment logs to see which account was used

## Manual Deployment (Fallback)

If GitHub Actions fails, you can still deploy manually:

**For Coscient:**
```bash
git checkout coscient-prod
./deploy-coscient.sh
```

**For PX-Tester:**
```bash
git checkout main
export $(cat .env | xargs)
npm run deploy
```

## Security Notes

### GitHub Secrets are Secure
- ✅ Encrypted at rest
- ✅ Not visible in logs
- ✅ Only accessible to GitHub Actions
- ✅ Cannot be read by other users

### API Token Permissions
Ensure your API tokens have minimal required permissions:
- Account: Workers R2 Storage (Edit)
- Account: Workers Scripts (Edit)

## Benefits of Auto-Deployment

- ✅ **Faster**: No manual build/deploy steps
- ✅ **Consistent**: Same process every time
- ✅ **Traceable**: Full deployment history in GitHub Actions
- ✅ **Reliable**: Automated testing and deployment
- ✅ **Convenient**: Push to deploy

## Summary

Once GitHub Secrets are configured:

1. **Push to `main`** → Auto-deploys to px-tester
2. **Push to `coscient-prod`** → Auto-deploys to coscient
3. **View status** → GitHub Actions tab
4. **No manual deployment needed!** 🎉

---

**Next Step**: Add the 4 GitHub Secrets, then test with a small commit!
