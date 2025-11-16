# Google Authentication Setup Guide

This guide walks you through setting up Google OAuth authentication for IdeaBox.

## Step 1: Create Google Cloud Project and Get Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 1.2 Create a New Project (or select existing)
1. Click the project dropdown at the top of the page
2. Click "New Project"
3. Enter project name: `IdeaBox` (or your preferred name)
4. Click "Create"
5. Wait for the project to be created and select it

### 1.3 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API"
4. Click "Enable"

### 1.4 Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: IdeaBox
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On the "Scopes" page, click "Save and Continue" (we'll use default scopes)
7. On the "Test users" page, add your email and any other test users
8. Click "Save and Continue"
9. Review and click "Back to Dashboard"

### 1.5 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click "**+ CREATE CREDENTIALS**" at the top
3. Select "**OAuth client ID**"
4. Choose "**Web application**" as the application type
5. Enter a name: `IdeaBox Web Client`
6. Under "**Authorized JavaScript origins**", add:
   - `http://localhost:5173` (for local development)
   - Your production URL (e.g., `https://yourdomain.com`)
7. Under "**Authorized redirect URIs**", add:
   - `http://localhost:5173` (for local development)
   - Your production URL (e.g., `https://yourdomain.com`)
8. Click "**Create**"

### 1.6 Copy Your Credentials
A dialog will appear with your credentials:
- **Client ID**: Something like `123456789-abcdefghijk.apps.googleusercontent.com`
- **Client Secret**: You won't need this for client-side OAuth

**IMPORTANT**: Copy the **Client ID** - you'll need it in the next step!

## Step 2: Configure Your Application

### 2.1 Create the Configuration File
1. In your project root, create a file named `google-auth-config.js`:

```javascript
// google-auth-config.js
export const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE'
```

2. Replace `YOUR_CLIENT_ID_HERE` with the Client ID you copied from Google Cloud Console

### 2.2 Verify .gitignore
The file `google-auth-config.js` is already added to `.gitignore` to prevent committing your credentials to Git.

## Step 3: Install Dependencies

Run the following command in your project directory:

```bash
npm install @react-oauth/google
```

## Step 4: Start Your Development Server

```bash
npm run dev
```

Your app should now require Google authentication before accessing the IdeaBox!

## Step 5: Deploy to Production

When deploying to production:

1. Create a new `google-auth-config.js` file on your production server with the same Client ID
2. Make sure your production URL is added to the "Authorized JavaScript origins" and "Authorized redirect URIs" in Google Cloud Console
3. If using Cloudflare Workers, you may need to add the configuration as an environment variable

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure your current URL (including port) is listed in "Authorized redirect URIs" in Google Cloud Console
- Check that there are no trailing slashes or typos

### "Access blocked: This app's request is invalid"
- Verify the OAuth consent screen is properly configured
- Make sure you've added yourself as a test user if the app is in testing mode

### "idpiframe_initialization_failed"
- Check that cookies are enabled in your browser
- Try clearing browser cache and cookies
- Make sure you're accessing the app via HTTP/HTTPS (not file://)

## Security Notes

1. **Never commit `google-auth-config.js` to Git** - it's already in `.gitignore`
2. The Client ID is safe to expose in client-side code (it's designed for that)
3. Never use or expose the Client Secret in client-side code
4. For production, consider using environment variables or a secure configuration management system

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
