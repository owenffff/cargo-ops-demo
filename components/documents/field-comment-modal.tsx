"use client"

import { useState } from "react"
import type { ExtractedBLField, FieldComment } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, MessageSquare } from "lucide-react"

interface FieldCommentModalProps {
  isOpen: boolean
  field: ExtractedBLField
  fieldKey: string
  onClose: () => void
  onAddComment: (fieldKey: string, comment: string) => void
}

export function FieldCommentModal({ isOpen, field, fieldKey, onClose, onAddComment }: FieldCommentModalProps) {
  const [comment, setComment] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(fieldKey, comment.trim())
      setComment("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Comment</h2>
              <p className="text-sm text-gray-600">{field.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Field Value */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-xs text-gray-600 mb-1">Current Value:</p>
            <p className="text-sm text-gray-900 font-mono">{field.value}</p>
          </div>

          {/* Existing Comments */}
          {field.comments && field.comments.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Previous Comments ({field.comments.length})</p>
              <div className="space-y-2">
                {field.comments.map((existingComment) => (
                  <div key={existingComment.id} className="p-3 bg-blue-50 border border-blue-100 rounded">
                    <p className="text-sm text-gray-900 mb-1">{existingComment.comment}</p>
                    <p className="text-xs text-gray-600">
                      {existingComment.user} • {new Date(existingComment.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Comment Input */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              New Comment
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment here..."
              className="w-full h-32"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this to add notes, questions, or clarifications about this field.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!comment.trim()} className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  )
}
