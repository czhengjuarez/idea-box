# Quick Start Guide - Google Authentication

## 🚀 Setup Steps (5 minutes)

### 1. Get Your Google Client ID

Follow the detailed instructions in `GOOGLE_AUTH_SETUP.md`, or use this quick checklist:

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project or select existing
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials (Web application)
- [ ] Add authorized origins: `http://localhost:5173`
- [ ] Copy your Client ID

### 2. Configure Your App

1. Open `google-auth-config.js` in the project root
2. Replace `'YOUR_CLIENT_ID_HERE'` with your actual Client ID:

```javascript
export const GOOGLE_CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com'
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Test It Out

1. Open http://localhost:5173 in your browser
2. You should see the login page
3. Click "Sign in with Google"
4. Authenticate with your Google account
5. You're in! 🎉

## 📁 Files Added

- `google-auth-config.js` - Your credentials (gitignored)
- `src/AuthContext.jsx` - Authentication state management
- `src/LoginPage.jsx` - Login UI component
- `GOOGLE_AUTH_SETUP.md` - Detailed setup instructions
- `QUICK_START.md` - This file

## 🔒 Security Notes

✅ `google-auth-config.js` is automatically gitignored
✅ User sessions persist in sessionStorage
✅ Logout clears all user data and votes

## ❓ Troubleshooting

**"Module not found: Can't resolve '../google-auth-config'"**
- Make sure you created `google-auth-config.js` in the project root
- Check that you replaced `YOUR_CLIENT_ID_HERE` with your actual Client ID

**"redirect_uri_mismatch"**
- Verify `http://localhost:5173` is in your Google Console authorized origins
- Make sure there are no trailing slashes

**Login button doesn't appear**
- Check browser console for errors
- Verify your Client ID is correct
- Try clearing browser cache

## 🚀 Deploy to Production

When deploying:

1. Create `google-auth-config.js` on your production server
2. Add your production URL to Google Console authorized origins
3. Deploy as usual with `npm run deploy`

For Cloudflare Workers, you may need to add the Client ID as an environment variable.

## 🔐 Email Domain Restrictions (Optional)

Want to restrict access to specific email domains (e.g., only `@yourcompany.com`)?

Edit `src/auth-config.js`:
```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = ['yourcompany.com']
```

To remove restrictions later and open to everyone:
```javascript
export const ALLOW_ALL_DOMAINS = true
```

See `EMAIL_DOMAIN_RESTRICTIONS.md` and `HOW_TO_REMOVE_DOMAIN_RESTRICTIONS.md` for details.

## 📚 More Help

- `GOOGLE_AUTH_SETUP.md` - Detailed Google Console setup
- `EMAIL_DOMAIN_RESTRICTIONS.md` - Configure domain restrictions
- `HOW_TO_REMOVE_DOMAIN_RESTRICTIONS.md` - Open access to everyone
