import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, CheckCircle, Plus, X, Pencil, ThumbsUp, Settings, LogOut } from 'lucide-react'
import { useAuth } from './AuthContext'
import LoginPage from './LoginPage'
import ManagePage from './ManagePage'
import RichTextEditor from './RichTextEditor'

// Custom Lightbulb Icon Component
function LightbulbIcon({ size = 20, className = '' }) {
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

// Component to render rich text HTML content
function FormattedText({ text }) {
  if (!text) return null
  
  // Render HTML content from rich text editor
  return (
    <div 
      className="rich-text-content prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

// Helper function to get display name based on visibility settings
// isAdmin: true when viewing from manage page, false for public page
function getDisplayName(idea, isAdmin = false) {
  // If no name provided, it's anonymous
  if (!idea.submittedBy) {
    return isAdmin ? 'Anonymous' : null
  }
  
  const visibility = idea.nameVisibility || 'everyone'
  
  // On public page, hide restricted names
  if (!isAdmin) {
    if (visibility === 'everyone') {
      return idea.submittedBy
    }
    return null // Hide PXLT on public page
  }
  
  // On admin/manage page, show everything with labels
  if (visibility === 'pxlt') {
    return `${idea.submittedBy} (PXLT only)`
  }
  return idea.submittedBy
}

// Sortable Idea Card Component
function SortableIdeaCard({ idea, onDelete, onEdit, onVote, hasVoted, currentUserEmail }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const cardStyle = {
    ...style,
    display: 'flex',
    width: '100%',
    minHeight: 'auto',
    flexDirection: 'column',
    borderRadius: '4px',
    border: '1px solid #D9D9D9',
    background: '#FFF',
    marginBottom: '12px',
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`${idea.status === 'ticket' ? 'border-l-4 border-l-green-500' : ''}`}
    >
      {/* Header with drag handle and votes */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={20} />
          </button>
          
          {/* Vote button and count */}
          <button
            onClick={() => onVote(idea.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              hasVoted
                ? 'border-[#8f1f57] bg-[#f5e6ed] text-[#8f1f57]'
                : 'border-gray-300 hover:border-[#8f1f57] hover:bg-[#f5e6ed]'
            }`}
          >
            <ThumbsUp size={16} className={hasVoted ? 'text-[#8f1f57] fill-[#8f1f57]' : 'text-gray-600'} />
            <span className={`text-sm font-medium ${hasVoted ? 'text-[#8f1f57]' : 'text-gray-700'}`}>{idea.votes || 0}</span>
          </button>
        </div>
        
        {idea.status === 'ticket' && (
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} />
              Ticket Created
            </span>
            {idea.ticketUrl && (
              <a
                href={idea.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8f1f57] hover:text-[#7a1a4a] underline text-sm"
              >
                View Ticket
              </a>
            )}
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="px-6 pb-3">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg text-gray-800">{idea.title}</h3>
          
          {getDisplayName(idea) && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Submitted by:</span> {getDisplayName(idea)}
            </p>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Problem:</span>
              <div className="text-gray-600 mt-1">
                <FormattedText text={idea.problem} />
              </div>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Proposed Solution:</span>
              <div className="text-gray-600 mt-1">
                <FormattedText text={idea.solution} />
              </div>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Potential Impact:</span>
              <div className="text-gray-600 mt-1">
                <FormattedText text={idea.impact} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="flex gap-2 px-6 pb-6 pt-3 border-t border-gray-100 flex-wrap items-center">
        {idea.ownerEmail === currentUserEmail ? (
          <>
            <button
              onClick={() => onEdit(idea.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#8f1f57] text-white rounded hover:bg-[#7a1a4a] transition-colors text-sm"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#E81403] text-white rounded hover:bg-[#c01002] transition-colors text-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-500 italic">
            You can only edit/delete your own ideas. Use Manage page for admin access.
          </span>
        )}
      </div>
    </div>
  )
}

function App() {
  const { user, logout, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState('main') // 'main' or 'manage'
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('suggestions') // 'suggestions' or 'tracked'
  const [isLoaded, setIsLoaded] = useState(false)
  const [votedIdeas, setVotedIdeas] = useState(() => {
    // Load voted ideas from sessionStorage on mount
    const stored = sessionStorage.getItem('votedIdeas')
    return stored ? JSON.parse(stored) : []
  })
  const [formData, setFormData] = useState({
    title: '',
    submittedBy: '',
    nameVisibility: 'everyone', // 'everyone', 'pxlt', 'ops', 'anonymous'
    problem: '',
    solution: '',
    impact: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Scroll to top when form is shown
  useEffect(() => {
    if (showForm) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showForm])

  // Reload ideas when returning from manage page
  useEffect(() => {
    if (currentPage === 'main') {
      fetch('/api/ideas')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            setIdeas(data)
          }
        })
        .catch(err => console.error('Error reloading ideas:', err))
    }
  }, [currentPage])

  // Load ideas from R2 API on mount and migrate legacy entries
  useEffect(() => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          // Migrate legacy entries without ownerEmail
          const migratedIdeas = data.map(idea => {
            if (!idea.ownerEmail) {
              // Assign legacy entries to a default owner
              return { ...idea, ownerEmail: 'legacy@cloudflare.com' }
            }
            return idea
          })
          setIdeas(migratedIdeas)
          
          // Save migrated data if any changes were made
          const hasLegacy = data.some(idea => !idea.ownerEmail)
          if (hasLegacy) {
            fetch('/api/ideas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(migratedIdeas)
            }).catch(err => console.error('Error migrating legacy entries:', err))
          }
        }
        setIsLoaded(true)
      })
      .catch(err => {
        console.error('Error loading ideas:', err)
        setIsLoaded(true)
      })
  }, [])

  // Save ideas to R2 API whenever they change (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideas)
      })
      .then(() => console.log('Ideas saved to R2'))
      .catch(err => console.error('Error saving ideas:', err))
    }
  }, [ideas, isLoaded])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setIdeas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      // Update existing idea (only if user owns it)
      const ideaToEdit = ideas.find(idea => idea.id === editingId)
      if (ideaToEdit && ideaToEdit.ownerEmail === user.email) {
        setIdeas(ideas.map((idea) => 
          idea.id === editingId ? { ...idea, ...formData } : idea
        ))
        setEditingId(null)
      } else {
        alert('You can only edit your own ideas.')
        return
      }
    } else {
      // Create new idea with ownership
      const newIdea = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        votes: 0,
        createdAt: new Date().toISOString(),
        ownerEmail: user.email, // Track who created this idea
      }
      setIdeas([...ideas, newIdea])
    }
    setFormData({
      title: '',
      submittedBy: '',
      nameVisibility: 'everyone',
      problem: '',
      solution: '',
      impact: '',
    })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    const ideaToDelete = ideas.find(idea => idea.id === id)
    if (ideaToDelete && ideaToDelete.ownerEmail === user.email) {
      if (window.confirm('Are you sure you want to delete this idea?')) {
        setIdeas(ideas.filter((idea) => idea.id !== id))
      }
    } else {
      alert('You can only delete your own ideas.')
    }
  }

  const handleEdit = (id) => {
    const ideaToEdit = ideas.find((idea) => idea.id === id)
    if (ideaToEdit) {
      // Check ownership
      if (ideaToEdit.ownerEmail !== user.email) {
        alert('You can only edit your own ideas. Use the Manage page for admin access.')
        return
      }
      setFormData({
        title: ideaToEdit.title,
        submittedBy: ideaToEdit.submittedBy,
        nameVisibility: ideaToEdit.nameVisibility || 'everyone',
        problem: ideaToEdit.problem,
        solution: ideaToEdit.solution,
        impact: ideaToEdit.impact,
      })
      setEditingId(id)
      setShowForm(true)
    }
  }

  const handleVote = (id) => {
    const hasVoted = votedIdeas.includes(id)
    
    if (hasVoted) {
      // Remove vote
      setIdeas(ideas.map((idea) => 
        idea.id === id ? { ...idea, votes: Math.max((idea.votes || 0) - 1, 0) } : idea
      ))
      const newVotedIdeas = votedIdeas.filter(ideaId => ideaId !== id)
      setVotedIdeas(newVotedIdeas)
      sessionStorage.setItem('votedIdeas', JSON.stringify(newVotedIdeas))
    } else {
      // Add vote
      setIdeas(ideas.map((idea) => 
        idea.id === id ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
      ))
      const newVotedIdeas = [...votedIdeas, id]
      setVotedIdeas(newVotedIdeas)
      sessionStorage.setItem('votedIdeas', JSON.stringify(newVotedIdeas))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LightbulbIcon size={64} className="mx-auto text-[#2C1EA9] mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />
  }

  // Route to manage page if selected
  if (currentPage === 'manage') {
    return <ManagePage onBack={() => setCurrentPage('main')} />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <LightbulbIcon size={40} className="text-[#2C1EA9]" />
            <h1 className="text-4xl font-bold text-gray-800">Idea Box</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your ideas for team improvements! Submit problems, solutions, and potential impacts. 
            Drag to prioritize and create tickets for top ideas.
          </p>
          
          {/* User Profile and Actions */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700 font-medium">{user.name}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage('manage')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings size={16} />
              Manage Submissions
            </button>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Add Idea Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 bg-[#8f1f57] text-white rounded-lg hover:bg-[#7a1a4a] transition-colors shadow-md font-medium"
          >
            <Plus size={20} />
            Submit New Idea
          </button>
        )}

        {/* Idea Submission Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{editingId ? 'Edit Idea' : 'Submit Your Idea'}</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    submittedBy: '',
                    nameVisibility: 'everyone',
                    problem: '',
                    solution: '',
                    impact: '',
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8f1f57]"
                  placeholder="Brief title for your idea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  name="submittedBy"
                  value={formData.submittedBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8f1f57]"
                  placeholder="Your name (optional)"
                />
                
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Who can see your name?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="nameVisibility"
                        value="everyone"
                        checked={formData.nameVisibility === 'everyone'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#8f1f57] focus:ring-2 focus:ring-[#8f1f57]"
                      />
                      <span className="text-sm text-gray-700">Everyone</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="nameVisibility"
                        value="pxlt"
                        checked={formData.nameVisibility === 'pxlt'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#8f1f57] focus:ring-2 focus:ring-[#8f1f57]"
                      />
                      <span className="text-sm text-gray-700">PXLT only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem *
                </label>
                <RichTextEditor
                  value={formData.problem}
                  onChange={(value) => setFormData({ ...formData, problem: value })}
                  placeholder="What problem does this address? Use the toolbar to format text."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Solution *
                </label>
                <RichTextEditor
                  value={formData.solution}
                  onChange={(value) => setFormData({ ...formData, solution: value })}
                  placeholder="How would you solve this? Use bold, italic, bullets, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Impact *
                </label>
                <RichTextEditor
                  value={formData.impact}
                  onChange={(value) => setFormData({ ...formData, impact: value })}
                  placeholder="What impact will this have? Format your text as needed."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-[#8f1f57] text-white rounded-md hover:bg-[#7a1a4a] transition-colors font-medium"
                >
                  Submit Idea
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-300 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'suggestions'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Suggestions
              {activeTab === 'suggestions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8f1f57]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tracked')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === 'tracked'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tracked
              {activeTab === 'tracked' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8f1f57]"></div>
              )}
            </button>
          </div>
        </div>

        {/* Ideas List */}
        {(() => {
          const filteredIdeas = ideas.filter((idea) => 
            activeTab === 'suggestions' ? idea.status !== 'ticket' : idea.status === 'ticket'
          )
          
          return filteredIdeas.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {activeTab === 'suggestions' ? 'Suggestions' : 'Tracked'} ({filteredIdeas.length})
                </h2>
                {activeTab === 'suggestions' && (
                  <p className="text-sm text-gray-600">
                    Drag to reorder by priority
                  </p>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredIdeas.map((idea) => idea.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredIdeas.map((idea) => (
                    <SortableIdeaCard
                      key={idea.id}
                      idea={idea}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onVote={handleVote}
                      hasVoted={votedIdeas.includes(idea.id)}
                      currentUserEmail={user.email}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <LightbulbIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {activeTab === 'suggestions' 
                  ? 'No suggestions yet. Submit one to get started!'
                  : 'No tracked ideas yet. Create tickets to move ideas here!'}
              </p>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default App
