"use client"

import type { ManifestComment } from "@/types"
import { MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface CommentHistoryProps {
  comments: ManifestComment[]
}

export function CommentHistory({ comments }: CommentHistoryProps) {
  const getIcon = (action: ManifestComment["action"]) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "reject":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "review":
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      default:
        return <MessageSquare className="w-5 h-5 text-blue-600" />
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No comments yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">{getIcon(comment.action)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-gray-900">{comment.user}</p>
              <p className="text-xs text-gray-500">{comment.timestamp}</p>
            </div>
            <p className="text-sm text-gray-700">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
