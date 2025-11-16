# Production Deployment Guide

## ✅ What's Ready

### Features Merged to `main` Branch
- ✅ Google OAuth authentication
- ✅ Email domain restrictions (cloudflare.com only)
- ✅ Ownership tracking for ideas
- ✅ Automatic legacy entry migration
- ✅ R2 API integration (preserves existing data)
- ✅ Admin access via Manage page

### Data Safety
- ✅ **Existing R2 entries will NOT be lost**
- ✅ Legacy entries automatically assigned to `legacy@cloudflare.com`
- ✅ Migration happens once on first load
- ✅ All existing data preserved with ownership tracking added

## 📋 Pre-Deployment Checklist

### 1. Google OAuth Setup
- [ ] Add production URL to Google Console Authorized JavaScript origins
  - Go to: https://console.cloud.google.com/apis/credentials
  - Edit your OAuth 2.0 Client ID
  - Add: `https://idea-box.YOUR-SUBDOMAIN.workers.dev`
  - Save changes

### 2. Verify google-auth-config.js
- [ ] Ensure `google-auth-config.js` exists locally
- [ ] Contains your Google Client ID
- [ ] File is gitignored (won't be deployed)
- [ ] **Important**: You'll need to set this as an environment variable for Workers

### 3. Set Cloudflare Workers Environment Variable
Since `google-auth-config.js` is gitignored, you need to set the Client ID as a secret:

```bash
# Set the Google Client ID as a secret
wrangler secret put GOOGLE_CLIENT_ID
# When prompted, paste your Client ID
```

Then update `src/main.jsx` to use the environment variable in production:

```javascript
// In src/main.jsx, we'll need to handle this differently for Workers
// For now, the build will include the local config
```

**Note**: For this deployment, the `google-auth-config.js` will be bundled with the build. For better security in future, consider using Wrangler secrets.

### 4. Test Build Locally
```bash
npm run build
npm run preview
```

- [ ] Test login with @cloudflare.com email
- [ ] Create a test idea
- [ ] Verify ownership restrictions work
- [ ] Test Manage page access
- [ ] Verify you can edit/delete from Manage page

## 🚀 Deployment Steps

### Step 1: Build for Production
```bash
npm run build
```

### Step 2: Deploy to Cloudflare Workers
```bash
npm run deploy
```

Or directly:
```bash
wrangler deploy
```

### Step 3: Verify Deployment
- [ ] Visit your production URL
- [ ] Verify Google login works
- [ ] Check that only @cloudflare.com emails can log in
- [ ] Create a test idea
- [ ] Verify ownership restrictions
- [ ] Access Manage page
- [ ] Verify existing entries show `legacy@cloudflare.com` as owner

## 🔍 Post-Deployment Verification

### Test Existing Data
1. **Check legacy entries**:
   - Go to Manage page
   - Verify existing ideas have `Owner: legacy@cloudflare.com`
   - Verify all data is intact (title, problem, solution, etc.)

2. **Test new entries**:
   - Create a new idea
   - Verify it has your email as owner
   - Verify you can edit/delete it
   - Log in with different @cloudflare.com account
   - Verify they CANNOT edit/delete your idea

3. **Test admin access**:
   - Go to Manage page
   - Verify you can edit ANY idea
   - Verify you can delete ANY idea
   - Verify owner emails are displayed

## 🔄 Migration Details

### What Happens on First Load
```javascript
// Automatic migration runs once
fetch('/api/ideas')
  .then(data => {
    const migratedIdeas = data.map(idea => {
      if (!idea.ownerEmail) {
        return { ...idea, ownerEmail: 'legacy@cloudflare.com' }
      }
      return idea
    })
    // Save back to R2 with ownership
    fetch('/api/ideas', { method: 'POST', body: migratedIdeas })
  })
```

### Before Migration
```json
{
  "id": "123",
  "title": "Old Idea",
  "problem": "...",
  "solution": "...",
  "impact": "..."
}
```

### After Migration
```json
{
  "id": "123",
  "title": "Old Idea",
  "problem": "...",
  "solution": "...",
  "impact": "...",
  "ownerEmail": "legacy@cloudflare.com"  // ← Added automatically
}
```

## ⚠️ Important Notes

### Data Safety
- ✅ **No data will be deleted**
- ✅ **All existing entries preserved**
- ✅ **Only adds `ownerEmail` field**
- ✅ **Migration is idempotent** (safe to run multiple times)

### Authentication
- 🔐 Only @cloudflare.com emails can log in
- 🔐 Users can only edit/delete their own ideas
- 🔐 Manage page has full admin access

### Legacy Entries
- 📦 Assigned to `legacy@cloudflare.com`
- 📦 Can be edited/deleted via Manage page
- 📦 Original creators won't be able to edit (unless reassigned)

## 🔧 Rollback Plan

If something goes wrong:

### Option 1: Revert Git
```bash
git revert HEAD
git push origin main
npm run deploy
```

### Option 2: Restore R2 Data
If you have a backup of R2 data:
1. Use Wrangler to restore the backup
2. Redeploy previous version

### Option 3: Quick Fix
If only auth is broken:
1. Edit `src/auth-config.js`
2. Set `ALLOW_ALL_DOMAINS = true`
3. Rebuild and redeploy

## 📊 Monitoring

After deployment, monitor:
- [ ] User login success rate
- [ ] API errors in Cloudflare dashboard
- [ ] User feedback on ownership restrictions
- [ ] Any issues with legacy entries

## 🎯 Success Criteria

Deployment is successful when:
- ✅ Users can log in with @cloudflare.com emails
- ✅ Users can create ideas with ownership
- ✅ Users can only edit/delete their own ideas
- ✅ Manage page has full admin access
- ✅ All existing entries preserved with legacy owner
- ✅ No data loss
- ✅ No authentication errors

## 📞 Support

If issues arise:
1. Check Cloudflare Workers logs
2. Check browser console for errors
3. Verify Google OAuth configuration
4. Test with different @cloudflare.com accounts
5. Check R2 bucket data integrity

## 🚀 Ready to Deploy?

Once all pre-deployment checks are complete:

```bash
npm run build
npm run deploy
```

Then verify everything works as expected!

---

**Last Updated**: Ready for production deployment
**Branch**: `main`
**Storage**: R2 (Cloudflare)
**Auth**: Google OAuth (@cloudflare.com only)
