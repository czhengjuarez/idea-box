import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, CheckCircle, Plus, X, Pencil, ThumbsUp } from 'lucide-react'

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

// Sortable Idea Card Component
function SortableIdeaCard({ idea, onDelete, onCreateTicket, onEdit, onVote }) {
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
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            Ticket Created
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="px-6 pb-3">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg text-gray-800">{idea.title}</h3>
          
          {idea.submittedBy && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Submitted by:</span> {idea.submittedBy}
            </p>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
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
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="flex gap-2 px-6 pb-6 pt-3 border-t border-gray-100 flex-wrap">
        {idea.status !== 'ticket' && (
          <button
            onClick={() => {
              window.open('https://jira.cfdata.org/browse/DES-12825', '_blank', 'noopener,noreferrer')
              onCreateTicket(idea.id)
            }}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#0051C3] text-[#0051C3] bg-white rounded hover:bg-blue-50 transition-colors text-sm"
          >
            <CheckCircle size={16} />
            Create Ticket
          </button>
        )}
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
  const [ideas, setIdeas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('suggestions') // 'suggestions' or 'tracked'
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    submittedBy: '',
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

  // LOCAL DEV: Save ideas to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('ideaBoxIdeas', JSON.stringify(ideas))
        console.log('💾 Ideas saved to localStorage')
      } catch (err) {
        console.error('Error saving ideas to localStorage:', err)
      }
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
      problem: '',
      solution: '',
      impact: '',
    })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id))
  }

  const handleCreateTicket = (id) => {
    setIdeas(ideas.map((idea) => 
      idea.id === id ? { ...idea, status: 'ticket' } : idea
    ))
  }

  const handleEdit = (id) => {
    const ideaToEdit = ideas.find((idea) => idea.id === id)
    if (ideaToEdit) {
      setFormData({
        title: ideaToEdit.title,
        submittedBy: ideaToEdit.submittedBy,
        problem: ideaToEdit.problem,
        solution: ideaToEdit.solution,
        impact: ideaToEdit.impact,
      })
      setEditingId(id)
      setShowForm(true)
      // Scroll to top to show the form
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        </div>

        {/* Add Idea Button */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem *
                </label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What problem does this address?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Solution *
                </label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How would you solve this?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potential Impact *
                </label>
                <textarea
                  name="impact"
                  value={formData.impact}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What impact would this have on the team?"
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
                      onCreateTicket={handleCreateTicket}
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
