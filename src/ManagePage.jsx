import { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowLeft, Trash2, CheckCircle } from 'lucide-react'

// Helper function to get display name (same as App.jsx but always in admin mode)
function getDisplayName(idea) {
  if (!idea.submittedBy) return 'No name provided'
  
  const visibility = idea.nameVisibility || 'everyone'
  
  switch (visibility) {
    case 'everyone':
      return `${idea.submittedBy} (Public)`
    case 'pxlt':
      return `${idea.submittedBy} (PXLT only)`
    case 'ops':
      return `${idea.submittedBy} (Ops only)`
    case 'anonymous':
      return 'Anonymous submission'
    default:
      return idea.submittedBy
  }
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simple hardcoded credentials for MVP
    // TODO: Replace with proper authentication
    if (email === 'admin@ideabox.com' && password === 'admin123') {
      onLogin()
      setError('')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Manage Ideas</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to view all submissions</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@ideabox.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Demo credentials:<br />
            <span className="font-mono text-xs">admin@ideabox.com / admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function ManagePage({ onBack }) {
  const [ideas, setIdeas] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      // Load ideas from localStorage
      try {
        const storedIdeas = localStorage.getItem('ideaBoxIdeas')
        if (storedIdeas) {
          const parsedIdeas = JSON.parse(storedIdeas)
          if (Array.isArray(parsedIdeas)) {
            setIdeas(parsedIdeas)
          }
        }
      } catch (err) {
        console.error('Error loading ideas:', err)
      }
    }
  }, [isAuthenticated])

  const handleDelete = (id) => {
    const updatedIdeas = ideas.filter((idea) => idea.id !== id)
    setIdeas(updatedIdeas)
    localStorage.setItem('ideaBoxIdeas', JSON.stringify(updatedIdeas))
  }

  const handleCreateTicket = (id) => {
    const updatedIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, status: 'ticket' } : idea
    )
    setIdeas(updatedIdeas)
    localStorage.setItem('ideaBoxIdeas', JSON.stringify(updatedIdeas))
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Public View
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Submissions</h1>
          <p className="text-gray-600 mt-2">
            View all ideas including restricted submissions. Total: {ideas.length}
          </p>
        </div>

        {/* Ideas List */}
        {ideas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No submissions yet
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  idea.status === 'ticket' ? 'border-l-4 border-l-green-500' : ''
                }`}
              >
                {/* Header with status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Submitted by:</span>{' '}
                        <span className="font-semibold">{getDisplayName(idea)}</span>
                      </span>
                      <span className="text-gray-500">
                        {idea.votes || 0} votes
                      </span>
                      {idea.status === 'ticket' && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle size={16} />
                          Ticket Created
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <span className="font-medium text-gray-700">Problem:</span>
                    <p className="text-gray-600 mt-1">{idea.problem}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Proposed Solution:</span>
                    <p className="text-gray-600 mt-1">{idea.solution}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Potential Impact:</span>
                    <p className="text-gray-600 mt-1">{idea.impact}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  {idea.status !== 'ticket' && (
                    <button
                      onClick={() => {
                        window.open('https://jira.cfdata.org/browse/DES-12825', '_blank', 'noopener,noreferrer')
                        handleCreateTicket(idea.id)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#0051C3] text-[#0051C3] bg-white rounded hover:bg-blue-50 transition-colors text-sm"
                    >
                      <CheckCircle size={16} />
                      Create Ticket
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagePage
