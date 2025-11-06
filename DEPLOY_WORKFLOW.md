# Deployment Workflow

## Branch Strategy

- **`main`** - Production branch with R2 API (from GitHub)
- **`local-dev`** - Local development branch with localStorage

## Local Development Workflow

### Work on Features
```bash
# Make sure you're on local-dev branch
git checkout local-dev

# Start development server
npm run dev

# Make your changes
# All data stored in localStorage (browser-only)
```

### Commit Your Changes
```bash
git add .
git commit -m "Your feature description"
```

## Deploying to Production

### Option 1: Merge to Main (Recommended)
```bash
# Switch to main branch
git checkout main

# Pull latest from GitHub
git pull origin main

# Merge your feature (will have conflicts in storage code)
git merge local-dev

# Resolve the conflict - keep R2 API code from main
# The storage useEffect hooks should use fetch('/api/ideas')

# Build and deploy
npm run build
npm run deploy:env

# Push to GitHub
git push origin main
```

### Option 2: Cherry-pick Specific Changes
```bash
# Switch to main
git checkout main

# Cherry-pick specific commits (avoiding storage changes)
git cherry-pick <commit-hash>

# Build and deploy
npm run build
npm run deploy:env
```

## Quick Reference

### Storage Code Differences

**local-dev branch (localStorage):**
```javascript
// LOCAL DEV: Load ideas from localStorage on mount
useEffect(() => {
  try {
    const storedIdeas = localStorage.getItem('ideaBoxIdeas')
    if (storedIdeas) {
      const parsedIdeas = JSON.parse(storedIdeas)
      if (Array.isArray(parsedIdeas)) {
        setIdeas(parsedIdeas)
      }
    }
  } catch (err) {
    console.error('Error loading ideas from localStorage:', err)
  } finally {
    setIsLoaded(true)
  }
}, [])
```

**main branch (R2 API):**
```javascript
// Load ideas from R2 API on mount
useEffect(() => {
  fetch('/api/ideas')
    .then(res => res.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        setIdeas(data)
      }
      setIsLoaded(true)
    })
    .catch(err => {
      console.error('Error loading ideas:', err)
      setIsLoaded(true)
    })
}, [])
```

## Tips

- **Always develop on `local-dev`** - keeps your work isolated
- **Keep `main` clean** - only merge tested features
- **R2 data is safe** - local-dev never touches production storage
- **Resolve conflicts carefully** - always keep R2 code when merging to main

## Verification

### After Deployment
1. Open https://idea-box.px-tester.workers.dev
2. Check browser console for "Ideas saved to R2"
3. Test data persistence across page reloads
4. Verify data is shared across different browsers/devices
