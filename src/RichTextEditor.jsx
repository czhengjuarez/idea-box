import { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function RichTextEditor({ value, onChange, placeholder, required }) {
  const quillRef = useRef(null)

  // Toolbar configuration - simplified for common formatting
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  }

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet'
  ]

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      {required && !value && (
        <input
          type="text"
          required
          value={value}
          onChange={() => {}}
          style={{ opacity: 0, height: 0, position: 'absolute' }}
          tabIndex={-1}
        />
      )}
    </div>
  )
}

export default RichTextEditor
