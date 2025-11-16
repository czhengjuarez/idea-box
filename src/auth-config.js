// Email Domain Restrictions
// Add the email domains that are allowed to access IdeaBox
// Examples: 'gmail.com', 'yourcompany.com', 'example.org'

export const ALLOWED_EMAIL_DOMAINS = [
  'cloudflare.com',
]

// Set to true to allow any email domain (no restrictions)
// Set to false to enforce domain restrictions
export const ALLOW_ALL_DOMAINS = false

// Helper function to check if an email is allowed
export function isEmailAllowed(email) {
  if (ALLOW_ALL_DOMAINS) {
    return true
  }
  
  if (!email) {
    return false
  }
  
  const emailDomain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_EMAIL_DOMAINS.some(domain => domain.toLowerCase() === emailDomain)
}
