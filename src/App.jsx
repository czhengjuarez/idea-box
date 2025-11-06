import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, CheckCircle, Plus, X, Pencil, ThumbsUp, Settings } from 'lucide-react'
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
function SortableIdeaCard({ idea, onDelete, onEdit, onVote }) {
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ThumbsUp size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{idea.votes || 0}</span>
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
                className="text-blue-600 hover:text-blue-800 underline text-sm"
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
      <div className="flex gap-2 px-6 pb-6 pt-3 border-t border-gray-100 flex-wrap">
        <button
          onClick={() => onEdit(idea.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#0051C3] text-white rounded hover:bg-[#003d99] transition-colors text-sm"
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
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('main') // 'main' or 'manage'
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('suggestions') // 'suggestions' or 'tracked'
  const [isLoaded, setIsLoaded] = useState(false)
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
      // Update existing idea
      setIdeas(ideas.map((idea) => 
        idea.id === editingId ? { ...idea, ...formData } : idea
      ))
      setEditingId(null)
    } else {
      // Create new idea
      const newIdea = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        votes: 0,
        createdAt: new Date().toISOString(),
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
    setIdeas(ideas.filter((idea) => idea.id !== id))
  }

  const handleEdit = (id) => {
    const ideaToEdit = ideas.find((idea) => idea.id === id)
    if (ideaToEdit) {
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
    setIdeas(ideas.map((idea) => 
      idea.id === id ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
    ))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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
          
          {/* Manage Button */}
          <button
            onClick={() => setCurrentPage('manage')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Settings size={16} />
            Manage Submissions
          </button>
        </div>

        {/* Add Idea Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
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
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
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
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
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
