# Domain Restrictions Cheatsheet

Quick reference for managing email domain access to IdeaBox.

## 📍 Configuration File Location
```
src/auth-config.js
```

## 🔓 Open to Everyone (Default)

```javascript
export const ALLOW_ALL_DOMAINS = true
export const ALLOWED_EMAIL_DOMAINS = []
```

**Result**: Anyone with a Google account can access IdeaBox.

---

## 🔒 Restrict to Specific Domains

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'yourcompany.com',
  'partner.org',
]
```

**Result**: Only users with `@yourcompany.com` or `@partner.org` emails can access.

---

## 🚫 Block Everyone (Maintenance Mode)

```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = []
```

**Result**: Nobody can access (useful for maintenance).

---

## 🔄 Quick Toggle Commands

### Switch from Restricted → Open
1. Open `src/auth-config.js`
2. Change `ALLOW_ALL_DOMAINS = false` to `true`
3. Run: `npm run build && npm run deploy`

### Switch from Open → Restricted
1. Open `src/auth-config.js`
2. Change `ALLOW_ALL_DOMAINS = true` to `false`
3. Add domains to `ALLOWED_EMAIL_DOMAINS` array
4. Run: `npm run build && npm run deploy`

---

## 📋 Common Configurations

### Single Company
```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = ['acme.com']
```

### Multiple Companies
```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'company-a.com',
  'company-b.com',
  'partner.org',
]
```

### Company + Gmail (for testing)
```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = [
  'company.com',
  'gmail.com',
]
```

### Admin Only
```javascript
export const ALLOW_ALL_DOMAINS = false
export const ALLOWED_EMAIL_DOMAINS = ['admin@company.com']
```

---

## ⚡ Quick Actions

| Action | Command |
|--------|---------|
| Edit config | Open `src/auth-config.js` |
| Test locally | `npm run dev` |
| Build for production | `npm run build` |
| Deploy | `npm run deploy` |
| Check current restrictions | Look at login page (shows allowed domains) |

---

## 🎯 Decision Matrix

| Scenario | Configuration |
|----------|---------------|
| Public launch | `ALLOW_ALL_DOMAINS = true` |
| Internal company tool | `ALLOW_ALL_DOMAINS = false` + company domain |
| Beta testing | `ALLOW_ALL_DOMAINS = false` + tester domains |
| Maintenance | `ALLOW_ALL_DOMAINS = false` + empty array |
| Development | `ALLOW_ALL_DOMAINS = true` (easier testing) |

---

## 📚 Full Documentation

- **Setup**: `GOOGLE_AUTH_SETUP.md`
- **Restrictions**: `EMAIL_DOMAIN_RESTRICTIONS.md`
- **Remove Restrictions**: `HOW_TO_REMOVE_DOMAIN_RESTRICTIONS.md`
- **Quick Start**: `QUICK_START.md`

---

## 💡 Pro Tips

1. **Keep a backup** of your restricted config in comments
2. **Test locally** before deploying restrictions
3. **Document** which domains are allowed (and why)
4. **Consider Google Workspace "Internal" mode** for stronger security
5. **Remember**: This is client-side only - add server-side validation for production

---

## 🆘 Emergency: Remove All Restrictions Now

```bash
# 1. Edit the file
open src/auth-config.js

# 2. Set ALLOW_ALL_DOMAINS = true

# 3. Deploy immediately
npm run build && npm run deploy
```

Done! ✅
