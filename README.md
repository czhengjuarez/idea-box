# Idea Box - Team Improvement Tracker

A modern web application for team members to submit, prioritize, and track improvement ideas. Deployed on **Cloudflare Workers** with **R2 storage** for persistent, shared data across all users.

🌐 **Live Demo**: [https://idea-box.px-tester.workers.dev](https://idea-box.px-tester.workers.dev)

## Features

- **Submit Ideas**: Team members can submit ideas with their name, problem description, proposed solution, and potential impact
- **Vote on Ideas**: Upvote ideas to show support and help prioritize
- **Drag & Drop Prioritization**: Stack rank ideas by dragging and dropping them to reorder by priority
- **Ticket Creation**: Mark prioritized ideas as tickets and open Jira for tracking
- **Tab Navigation**: Separate views for "Suggestions" and "Tracked" ideas
- **R2 Storage**: All ideas are stored in Cloudflare R2 and shared across all users
- **Real-time Sync**: Changes are automatically saved and visible to all team members

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

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This app is deployed on **Cloudflare Workers** with **R2 storage** for persistent data.

### Setup Credentials

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

### Deploy to Cloudflare

```bash
npm run deploy:env
```

This will build the app and deploy it to Cloudflare Workers with R2 storage.

For detailed deployment instructions, see [DEPLOY.md](./DEPLOY.md).

### R2 Storage Setup

The app uses Cloudflare R2 for persistent storage. All ideas are stored in a JSON file in R2 and shared across all users.

To set up R2:
1. Enable R2 in your Cloudflare Dashboard
2. Create an R2 bucket named `idea-box`
3. Deploy the worker (it will automatically connect to R2)

For detailed R2 setup instructions, see [R2_SETUP.md](./R2_SETUP.md).

## Usage

1. **Submit an Idea**: Click the "Submit New Idea" button and fill out the form with:
   - Idea Title
   - Your Name
   - Problem description
   - Proposed Solution
   - Potential Impact

2. **Vote on Ideas**: Click the thumbs-up button to upvote ideas you support

3. **Prioritize Ideas**: Drag ideas up or down using the grip handle to reorder them by priority

4. **Create Tickets**: Click the "Create Ticket" button on prioritized ideas to open Jira and mark them as tracked

5. **View Tracked Ideas**: Switch to the "Tracked" tab to see ideas that have been converted to tickets

6. **Edit or Delete**: Use the edit button to modify ideas or delete button to remove them

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
