"use client"

import type { ExtractedBLFields } from "@/types"

interface DocumentApprovalPanelProps {
  extractedFields: ExtractedBLFields
}

export function DocumentApprovalPanel({ extractedFields }: DocumentApprovalPanelProps) {
  // Calculate stats
  const allFields = Object.values(extractedFields)
  const totalFields = allFields.length
  const fieldsModified = allFields.filter((f) => f.isModified).length
  const fieldsFlagged = allFields.filter((f) => f.isFlagged).length
  const lowConfidenceFields = allFields.filter((f) => f.confidence < 95).length

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          {/* Stats Only */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Statistics</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Total Fields</p>
                <p className="text-2xl font-bold text-gray-900">{totalFields}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fields Modified</p>
                <p className="text-2xl font-bold text-blue-700">{fieldsModified}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fields Flagged</p>
                <p className="text-2xl font-bold text-red-700">{fieldsFlagged}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Low Confidence</p>
                <p className="text-2xl font-bold text-amber-700">{lowConfidenceFields}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
