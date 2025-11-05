"use client"

import type { ExtractedBLField } from "@/types"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RotateCcw } from "lucide-react"

interface FieldReviewTooltipProps {
  field: ExtractedBLField
  fieldKey: string
  onRevert: (fieldKey: string) => void
}

export function FieldReviewTooltip({ field, fieldKey, onRevert }: FieldReviewTooltipProps) {
  const isLowConfidence = field.confidence < 95

  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{field.label}</h4>
          <p className="text-xs text-gray-500 mt-0.5">Review Details</p>
        </div>
        {field.isFlagged && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium">Flagged</span>
        )}
      </div>

      {/* Original AI Value */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-gray-600">Original AI Value</p>
          <div className="flex items-center gap-1">
            {isLowConfidence ? (
              <AlertCircle className="w-3 h-3 text-amber-600" />
            ) : (
              <CheckCircle className="w-3 h-3 text-green-600" />
            )}
            <span className="text-xs text-gray-600">{field.confidence}%</span>
          </div>
        </div>
        <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-900 font-mono">{field.originalValue}</div>
      </div>

      {/* Current Value (if modified) */}
      {field.isModified && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-1">Current Value</p>
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-900 font-mono mb-1">{field.value}</p>
            {field.modifiedBy && (
              <p className="text-xs text-blue-700">
                ✏️ Modified by {field.modifiedBy}
                {field.modifiedAt && ` on ${new Date(field.modifiedAt).toLocaleString()}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      {field.comments && field.comments.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-2">Comments ({field.comments.length})</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {field.comments.map((comment) => (
              <div key={comment.id} className="px-3 py-2 bg-gray-50 rounded text-xs">
                <p className="text-gray-900">{comment.comment}</p>
                <p className="text-gray-500 mt-1">
                  — {comment.user} • {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {field.isModified && (
        <div className="pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRevert(fieldKey)}
            className="w-full gap-2 text-gray-700"
          >
            <RotateCcw className="w-3 h-3" />
            Revert to Original
          </Button>
        </div>
      )}
    </div>
  )
}
