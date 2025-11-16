# Idea Box - Team Improvement Tracker

A modern web application for team members to submit, prioritize, and track improvement ideas. Deployed on **Cloudflare Workers** with **R2 storage** for persistent, shared data across all users.

🌐 **Live Demo**: [https://idea-box.px-tester.workers.dev](https://idea-box.px-tester.workers.dev)

## Features

### Idea Submission & Management
- **Rich Text Editor**: Submit ideas with formatted text including **bold**, *italic*, underline, bullet points, and numbered lists
- **Name Privacy Options**: Choose who can see your name:
  - **Everyone** - Name visible to all users
  - **PXLT Only** - Name visible only to PXLT team in admin view
  - Leave name blank for anonymous submissions
- **Vote on Ideas**: Upvote ideas to show support and help prioritize
- **Drag & Drop Prioritization**: Stack rank ideas by dragging and dropping them to reorder by priority

### Admin Management
- **Secure Admin Portal**: Access management features via Settings icon (⚙️)
  - Login: `pxlt@cloudflare.com` / `pxlt2025`
- **Edit Ideas**: Admin can edit any submitted idea
- **Create Tickets**: Mark prioritized ideas as tickets and open Jira for tracking (admin-only)
- **Delete Ideas**: Remove ideas from the system

### Organization & Display
- **Tab Navigation**: Separate views for "Suggestions" and "Tracked" ideas
- **Formatted Display**: Rich text formatting preserved in idea cards
- **Real-time Sync**: Changes automatically saved and visible to all team members

### Data & Storage
- **R2 Storage**: All ideas stored in Cloudflare R2 and shared across all users
- **Persistent Data**: Ideas persist across sessions and devices
- **Automatic Sync**: Changes between public and admin views sync automatically

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Development Workflow

This project uses a two-branch strategy:
- **`main`** - Production branch with R2 API (deployed to Cloudflare Workers)
- **`local-dev`** - Development branch with localStorage (for local testing)

**For local development:**
1. Checkout `local-dev` branch: `git checkout local-dev`
2. Make changes and test locally with `npm run dev`
3. Commit changes to `local-dev`
4. When ready to deploy, merge to `main` (see [DEPLOY_WORKFLOW.md](./DEPLOY_WORKFLOW.md))

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This app is deployed on **Cloudflare Workers** with **R2 storage** for persistent data.

### 🚀 Automatic Deployment (Recommended)

**GitHub Actions automatically deploys your app when you push to GitHub!**

This project has two instances with auto-deployment:
- **`main` branch** → Deploys to px-tester (Cloudflare internal, @cloudflare.com only)
- **`coscient-prod` branch** → Deploys to coscient (Public, any Google account)

#### How It Works

Every time you push to GitHub:
```bash
# Update internal version
git checkout main
git add .
git commit -m "Update feature"
git push origin main
# ✅ Auto-deploys to https://idea-box.px-tester.workers.dev

# Update public version
git checkout coscient-prod
git add .
git commit -m "Update feature"
git push origin coscient-prod
# ✅ Auto-deploys to https://idea-box.coscient.workers.dev
```

#### Setup Auto-Deployment

1. **Add GitHub Secrets** (one-time setup):
   - Go to: `https://github.com/YOUR_USERNAME/idea-box/settings/secrets/actions`
   - Add these 5 secrets:
     - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
     - `PX_TESTER_CLOUDFLARE_API_TOKEN` - API token for px-tester account
     - `PX_TESTER_CLOUDFLARE_ACCOUNT_ID` - Account ID for px-tester
     - `COSCIENT_CLOUDFLARE_API_TOKEN` - API token for coscient account
     - `COSCIENT_CLOUDFLARE_ACCOUNT_ID` - Account ID for coscient

2. **That's it!** Push to deploy automatically.

For detailed setup instructions, see [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md).

#### Disable Auto-Deployment

If you want to deploy manually instead:

1. **Delete or disable the workflow files**:
   ```bash
   # Option 1: Delete workflows (can restore from git history)
   rm .github/workflows/deploy-px-tester.yml
   rm .github/workflows/deploy-coscient.yml
   git commit -m "Disable auto-deployment"
   git push
   
   # Option 2: Disable in GitHub UI
   # Go to: Actions → Select workflow → "..." menu → Disable workflow
   ```

2. **Use manual deployment** (see below)

### 📦 Manual Deployment

If you prefer to deploy manually:

#### Setup Credentials

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Cloudflare API token:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Copy the token

3. Add your token to `.env`:
   ```
   CLOUDFLARE_API_TOKEN=your_token_here
   ```

**Note**: The `.env` file is gitignored and stores your credentials locally. Never commit this file to Git!

#### Deploy to Cloudflare

```bash
npm run deploy
```

This will build the app and deploy it to Cloudflare Workers with R2 storage.

For detailed deployment instructions, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).

### R2 Storage Setup

The app uses Cloudflare R2 for persistent storage. All ideas are stored in a JSON file in R2 and shared across all users.

To set up R2:
1. Enable R2 in your Cloudflare Dashboard
2. Create an R2 bucket named `idea-box`
3. Deploy the worker (it will automatically connect to R2)

For detailed R2 setup instructions, see [R2_SETUP.md](./R2_SETUP.md).

## Usage

### For Team Members

1. **Submit an Idea**: Click the "Submit New Idea" button and fill out the form with:
   - Idea Title
   - Your Name (optional)
   - Name Visibility (Everyone or PXLT only)
   - Problem description (with rich text formatting)
   - Proposed Solution (with rich text formatting)
   - Potential Impact (with rich text formatting)

2. **Use Rich Text Formatting**: 
   - Select text and use the toolbar to apply **bold**, *italic*, or underline
   - Click bullet or numbered list buttons to create lists
   - Format is preserved when displayed

3. **Vote on Ideas**: Click the thumbs-up button to upvote ideas you support

4. **Prioritize Ideas**: Drag ideas up or down using the grip handle to reorder them by priority

5. **View Tracked Ideas**: Switch to the "Tracked" tab to see ideas that have been converted to tickets

### For Administrators

1. **Access Admin Portal**: Click the Settings icon (⚙️) in the top right corner

2. **Login**: Use credentials `pxlt@cloudflare.com` / `pxlt2025`

3. **Manage Ideas**: In the admin portal you can:
   - View all submitted ideas with full name visibility
   - Edit any idea (title, name, visibility, problem, solution, impact)
   - Delete ideas
   - Create tickets for prioritized ideas (opens Jira)

4. **Return to Public View**: Click "Back to Public View" to return to the main page

All changes are automatically saved to R2 storage and synced across all users in real-time.

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Icons

### Backend & Deployment
- **Cloudflare Workers** - Serverless edge computing platform
- **Cloudflare R2** - Object storage for persistent data (ideas stored as JSON)
- **Workers KV** - Static asset delivery
- **Wrangler** - Cloudflare Workers CLI for deployment

## Use Cases

This app supports various team improvement workflows:

- Set up a shared tracking system for change ideas
- Review feedback from surveys or retrospectives
- Facilitate team brainstorms for improvement opportunities
- Host monthly "improvement spotlights"
- Track progress on survey-related initiatives
- Encourage team members to propose meaningful changes

## License

MIT
