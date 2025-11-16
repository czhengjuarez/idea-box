# Email Domain Restrictions

## Overview

You can restrict access to IdeaBox to only users with specific email domains (e.g., only `@yourcompany.com` emails).

## Configuration

Edit `src/auth-config.js` to configure domain restrictions:

### Option 1: Allow All Domains (Default)

```javascript
export const ALLOW_ALL_DOMAINS = true
export const ALLOWED_EMAIL_DOMAINS = []
```

This allows anyone with a Google account to log in.

### Option 2: Restrict to Specific Domains

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'yourcompany.com',
  'example.com',
]
```

This only allows users with `@yourcompany.com` or `@example.com` email addresses.

## Examples

### Example 1: Single Company Domain

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'acme.com',
]
```

Only `user@acme.com` emails can access IdeaBox.

### Example 2: Multiple Domains

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'company.com',
  'company.co.uk',
  'subsidiary.com',
]
```

Allows users from multiple related domains.

### Example 3: Development + Production Domains

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'yourcompany.com',
  'gmail.com',  // For testing
]
```

Useful during development to allow test accounts.

## User Experience

### When Domain is Allowed ✅
- User logs in with Google
- Immediately gains access to IdeaBox

### When Domain is Blocked ❌
- User logs in with Google
- Sees error message: "Access denied. Only users with email addresses from the following domains are allowed: [domains]"
- Cannot access IdeaBox
- Can try logging in with a different Google account

## Visual Indicators

When `ALLOW_ALL_DOMAINS = false`:
- Login page shows a blue info box listing allowed domains
- Users know which email domains are accepted before attempting login

## Testing

### Test Allowed Domain
1. Set `ALLOW_ALL_DOMAINS = false`
2. Add your email domain to `ALLOWED_EMAIL_DOMAINS`
3. Log in with your email → Should work ✅

### Test Blocked Domain
1. Keep `ALLOW_ALL_DOMAINS = false`
2. Log in with an email NOT in `ALLOWED_EMAIL_DOMAINS`
3. Should see "Access denied" error ❌

## Security Notes

⚠️ **Important**: This is client-side validation only. A determined user could bypass this by modifying the code. For production security:

1. **Recommended**: Add server-side domain validation in your R2 Worker/API
2. **Alternative**: Use Google Workspace with domain restrictions in Google Cloud Console
3. **Best Practice**: Combine both client-side (UX) and server-side (security) validation

## Google Workspace Integration (Optional)

If you have Google Workspace, you can also restrict at the Google OAuth level:

1. Go to Google Cloud Console > OAuth consent screen
2. Change user type from "External" to "Internal"
3. Only users in your Google Workspace organization can authenticate

This is more secure than client-side validation.

## Deployment

### Local Development
Edit `src/auth-config.js` directly.

### Production
Make sure `src/auth-config.js` is configured correctly before building:

```bash
npm run build
npm run deploy
```

The configuration is bundled into your production build.

## Troubleshooting

**Q: I added my domain but still can't log in**
- Check spelling and capitalization (case-insensitive matching is used)
- Make sure `ALLOW_ALL_DOMAINS = false`
- Check browser console for errors
- Verify your email actually uses that domain

**Q: Can I use wildcards like `*.company.com`?**
- Not currently supported
- You need to list each subdomain explicitly:
  ```javascript
  ALLOWED_EMAIL_DOMAINS = [
    'company.com',
    'dev.company.com',
    'staging.company.com',
  ]
  ```

**Q: How do I remove restrictions?**
- Set `ALLOW_ALL_DOMAINS = true`
- Or leave `ALLOWED_EMAIL_DOMAINS = []` empty with `ALLOW_ALL_DOMAINS = false` (blocks everyone)

## How to Remove Restrictions

To open access to everyone with a Google account:

1. Edit `src/auth-config.js`
2. Set `ALLOW_ALL_DOMAINS = true`
3. Rebuild and deploy

See **`HOW_TO_REMOVE_DOMAIN_RESTRICTIONS.md`** for detailed instructions.

## Summary

- ✅ Easy to configure in `src/auth-config.js`
- ✅ Clear error messages for blocked users
- ✅ Visual indicators on login page
- ✅ Easy to toggle between restricted and open access
- ⚠️ Client-side only (consider server-side validation for production)
- 🔒 Use Google Workspace "Internal" mode for stronger security
