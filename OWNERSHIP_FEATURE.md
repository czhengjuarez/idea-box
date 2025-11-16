# Idea Ownership Feature

## Overview

Users can now only edit and delete their own ideas on the main page. The Manage page retains full admin access to edit/delete any idea.

## How It Works

### Main Page (Public View)
- **Your Ideas**: Full edit/delete access with visible buttons
- **Others' Ideas**: No edit/delete buttons, shows message: "You can only edit/delete your own ideas. Use Manage page for admin access."
- **Voting**: Everyone can vote on any idea

### Manage Page (Admin View)
- **Full Access**: Can edit/delete any idea regardless of owner
- **Owner Visibility**: Shows owner email for each idea
- **Legacy Entries**: Displays `legacy@cloudflare.com` for old entries

## Ownership Tracking

### New Ideas
When a user creates an idea, it's automatically assigned to them:
```javascript
{
  id: "...",
  title: "My Idea",
  ownerEmail: "user@cloudflare.com",  // Automatically set
  // ... other fields
}
```

### Legacy Ideas
Existing ideas without an owner are automatically migrated to:
```javascript
{
  ownerEmail: "legacy@cloudflare.com"
}
```

This happens automatically on first load after the feature is deployed.

## User Experience

### Creating an Idea
1. User logs in with Google
2. Clicks "Submit New Idea"
3. Fills out the form
4. Submits → Idea is automatically assigned to their email

### Editing Your Own Idea
1. User sees their idea with Edit/Delete buttons
2. Clicks Edit → Form opens with current data
3. Makes changes and saves
4. ✅ Success

### Trying to Edit Someone Else's Idea
1. User sees someone else's idea
2. No Edit/Delete buttons visible
3. Message shown: "You can only edit/delete your own ideas. Use Manage page for admin access."
4. If they somehow trigger edit (e.g., via browser console):
   - Alert: "You can only edit your own ideas. Use the Manage page for admin access."
   - Edit is blocked

### Admin Access (Manage Page)
1. Admin logs into Manage page
2. Sees all ideas with owner emails displayed
3. Can edit/delete any idea regardless of owner
4. Full administrative control

## Technical Implementation

### Data Structure
Each idea now includes:
```javascript
{
  id: string,
  title: string,
  submittedBy: string,           // Display name (optional)
  nameVisibility: string,         // 'everyone' or 'pxlt'
  problem: string,
  solution: string,
  impact: string,
  status: string,                 // 'pending' or 'ticket'
  votes: number,
  createdAt: string,
  ownerEmail: string,             // NEW: Email of creator
  ticketUrl?: string,
}
```

### Ownership Checks

#### Main Page (App.jsx)
```javascript
// Only show buttons if user owns the idea
{idea.ownerEmail === currentUserEmail ? (
  <EditButton />
  <DeleteButton />
) : (
  <Message>You can only edit/delete your own ideas</Message>
)}
```

#### Manage Page (ManagePage.jsx)
```javascript
// Always show buttons - full admin access
<EditButton />
<DeleteButton />
```

### Migration Logic
```javascript
// Automatically runs on load
const migratedIdeas = data.map(idea => {
  if (!idea.ownerEmail) {
    return { ...idea, ownerEmail: 'legacy@cloudflare.com' }
  }
  return idea
})
```

## Security Notes

### Client-Side Only
⚠️ **Important**: This is client-side validation only. A determined user could:
- Modify browser localStorage/sessionStorage
- Use browser dev tools to bypass checks
- Directly call API endpoints

### For Production Security
Consider adding server-side validation:

```javascript
// In your R2 Worker (src/worker.js)
if (request.method === 'POST') {
  const ideas = await request.json()
  const userEmail = request.headers.get('X-User-Email')
  
  // Validate ownership before saving
  const validatedIdeas = ideas.map(idea => {
    if (idea.ownerEmail !== userEmail && userEmail !== 'admin@cloudflare.com') {
      throw new Error('Unauthorized')
    }
    return idea
  })
  
  await bucket.put(IDEAS_KEY, JSON.stringify(validatedIdeas))
}
```

## Legacy Entry Management

### Default Owner
All legacy entries are assigned to: `legacy@cloudflare.com`

### Reassigning Legacy Entries
Admins can reassign legacy entries via the Manage page:
1. Go to Manage page
2. Click Edit on a legacy entry
3. The owner remains `legacy@cloudflare.com` (stored in backend)
4. Only display name can be changed

### Identifying Legacy Entries
In the Manage page, look for:
```
Owner: legacy@cloudflare.com
```

## Testing

### Test Scenario 1: Create and Edit Your Own Idea
1. Log in as `user1@cloudflare.com`
2. Create an idea
3. ✅ Should see Edit/Delete buttons
4. Click Edit → Should work
5. Click Delete → Should work

### Test Scenario 2: Try to Edit Someone Else's Idea
1. Log in as `user1@cloudflare.com`
2. View an idea owned by `user2@cloudflare.com`
3. ✅ Should NOT see Edit/Delete buttons
4. ✅ Should see message about using Manage page

### Test Scenario 3: Admin Access
1. Log into Manage page
2. ✅ Should see owner email for each idea
3. ✅ Should be able to edit any idea
4. ✅ Should be able to delete any idea

### Test Scenario 4: Legacy Entry Migration
1. Have existing ideas without `ownerEmail`
2. Load the app
3. ✅ Legacy entries should automatically get `legacy@cloudflare.com`
4. ✅ Migration should save to R2
5. ✅ Subsequent loads should not re-migrate

## Troubleshooting

### "You can only edit your own ideas" but it IS my idea
- Check that you're logged in with the same email used to create the idea
- Check the Manage page to see the actual owner email
- Legacy entries belong to `legacy@cloudflare.com`, not individual users

### Edit/Delete buttons not showing for my ideas
- Verify you're logged in
- Check browser console for errors
- Ensure `user.email` matches `idea.ownerEmail`

### Can't edit anything on main page
- All your ideas should show buttons
- Others' ideas should not show buttons
- Use Manage page for admin access to all ideas

## Future Enhancements

### Potential Improvements
1. **Server-side validation**: Add ownership checks in R2 Worker
2. **Transfer ownership**: Allow admins to reassign ideas
3. **Bulk reassignment**: Tool to reassign all legacy entries
4. **Ownership history**: Track ownership changes
5. **Collaborative editing**: Allow multiple owners per idea
6. **Role-based access**: Different permission levels (viewer, editor, admin)

## Summary

- ✅ Users can only edit/delete their own ideas on main page
- ✅ Manage page has full admin access
- ✅ Legacy entries automatically migrated to `legacy@cloudflare.com`
- ✅ Ownership tracked by email address
- ✅ Clear visual indicators for ownership
- ⚠️ Client-side only - consider server-side validation for production
