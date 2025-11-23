import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { AlertCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { isEmailAllowed, ALLOWED_EMAIL_DOMAINS, ALLOW_ALL_DOMAINS } from './auth-config'

// Custom Lightbulb Icon Component
function LightbulbIcon({ size = 40, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_5043_1401)">
        <path d="M12.507 18.7566H7.49484V19.9834H12.507V18.7566Z" fill="currentColor"/>
        <path d="M10.5867 0H9.35984V2.64906H10.5867V0Z" fill="currentColor"/>
        <path d="M16.2015 2.53296L14.3286 4.40591L15.1959 5.27322L17.0688 3.40028L16.2015 2.53296Z" fill="currentColor"/>
        <path d="M19.4105 8.99969H16.7617V10.2266H19.4105V8.99969Z" fill="currentColor"/>
        <path d="M3.23859 9.05344H0.589844V10.2803H3.23859V9.05344Z" fill="currentColor"/>
        <path d="M3.76075 2.57109L2.89341 3.43837L4.76651 5.31161L5.63385 4.44433L3.76075 2.57109Z" fill="currentColor"/>
        <path d="M10.0002 3.81875C8.73874 3.81848 7.51138 4.22798 6.50282 4.98559C5.49427 5.74321 4.75911 6.80794 4.40801 8.01951C4.05691 9.23108 4.10888 10.5239 4.55609 11.7034C5.0033 12.8829 5.82155 13.8852 6.88766 14.5594V16.8688L7.50016 17.4844H12.5002L13.1127 16.8688V14.5594C14.1788 13.8852 14.997 12.8829 15.4442 11.7034C15.8914 10.5239 15.9434 9.23108 15.5923 8.01951C15.2412 6.80794 14.506 5.74321 13.4975 4.98559C12.4889 4.22798 11.2616 3.81848 10.0002 3.81875ZM12.2064 13.6719L11.8877 13.8469V16.2563H8.11266V13.8469L7.79391 13.6719C6.8982 13.1819 6.19111 12.4076 5.78418 11.4712C5.37725 10.5348 5.29364 9.48961 5.54652 8.50044C5.79941 7.51127 6.37441 6.63444 7.18083 6.00825C7.98724 5.38207 8.97917 5.04217 10.0002 5.04217C11.0211 5.04217 12.0131 5.38207 12.8195 6.00825C13.6259 6.63444 14.2009 7.51127 14.4538 8.50044C14.7067 9.48961 14.6231 10.5348 14.2161 11.4712C13.8092 12.4076 13.1021 13.1819 12.2064 13.6719Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_5043_1401">
          <rect width="20" height="20" rx="5" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token to get user information
      const decoded = jwtDecode(credentialResponse.credential)
      
      // Check if email domain is allowed
      if (!isEmailAllowed(decoded.email)) {
        const allowedDomains = ALLOWED_EMAIL_DOMAINS.join(', ')
        setError(
          `Access denied. Only users with email addresses from the following domains are allowed: ${allowedDomains}`
        )
        return
      }
      
      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub, // Google user ID
      }
      
      setError(null)
      login(userData)
    } catch (error) {
      console.error('Error decoding token:', error)
      setError('An error occurred during login. Please try again.')
    }
  }

  const handleError = () => {
    console.error('Login Failed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6ed] to-[#e6d4dc] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <LightbulbIcon size={48} className="text-[#2C1EA9]" />
            <h1 className="text-4xl font-bold text-gray-800">Idea Box</h1>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            Share your ideas for team improvements! Sign in with your Google account to get started.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800 text-left">{error}</p>
            </div>
          )}
          
          {/* Domain Restriction Info */}
          {!ALLOW_ALL_DOMAINS && ALLOWED_EMAIL_DOMAINS.length > 0 && (
            <div className="mb-6 p-3 bg-[#f5e6ed] border border-[#d4a5bb] rounded-lg">
              <p className="text-xs text-[#7a1a4a]">
                <strong>Restricted Access:</strong> Only emails from {ALLOWED_EMAIL_DOMAINS.join(', ')} are allowed.
              </p>
            </div>
          )}
          
          {/* Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              By signing in, you agree to use this platform for team collaboration and idea sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
