# Idea Box - Team Improvement Tracker

A modern web application for team members to submit, prioritize, and track improvement ideas.

## Features

- **Submit Ideas**: Team members can submit ideas with their name, problem description, proposed solution, and potential impact
- **Drag & Drop Prioritization**: Stack rank ideas by dragging and dropping them to reorder by priority
- **Ticket Creation**: Mark prioritized ideas as tickets for implementation
- **Local Storage**: All ideas are automatically saved to browser local storage for persistence
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and Lucide icons

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

## Usage

1. **Submit an Idea**: Click the "Submit New Idea" button and fill out the form with:
   - Idea Title
   - Your Name
   - Problem description
   - Proposed Solution
   - Potential Impact

2. **Prioritize Ideas**: Drag ideas up or down using the grip handle to reorder them by priority

3. **Create Tickets**: Click the "Create Ticket" button on prioritized ideas to mark them for implementation

4. **Delete Ideas**: Remove ideas that are no longer relevant using the delete button

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Icons
- **Local Storage** - Data persistence

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
