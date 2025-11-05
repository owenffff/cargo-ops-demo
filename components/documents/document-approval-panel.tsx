"use client"

import { useState } from "react"
import type { DocumentReviewStatus, ExtractedBLFields } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, AlertTriangle, FileCheck, Edit3 } from "lucide-react"

interface DocumentApprovalPanelProps {
  reviewStatus?: DocumentReviewStatus
  extractedFields: ExtractedBLFields
  locked?: boolean
  onApprove: (notes: string) => void
  onReject: (notes: string) => void
  onRequestChanges: (notes: string) => void
  onUnlock?: () => void
}

export function DocumentApprovalPanel({
  reviewStatus,
  extractedFields,
  locked,
  onApprove,
  onReject,
  onRequestChanges,
  onUnlock,
}: DocumentApprovalPanelProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [showApprovalForm, setShowApprovalForm] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | "changes" | null>(null)

  // Calculate stats
  const allFields = Object.values(extractedFields)
  const totalFields = allFields.length
  const fieldsModified = allFields.filter((f) => f.isModified).length
  const fieldsFlagged = allFields.filter((f) => f.isFlagged).length
  const lowConfidenceFields = allFields.filter((f) => f.confidence < 95).length

  const status = reviewStatus?.status || "pending_review"

  const getStatusBadge = () => {
    switch (status) {
      case "pending_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            <FileCheck className="w-4 h-4" />
            Pending Review
          </span>
        )
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Edit3 className="w-4 h-4" />
            In Review
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        )
    }
  }

  const handleActionClick = (selectedAction: "approve" | "reject" | "changes") => {
    setAction(selectedAction)
    setShowApprovalForm(true)
  }

  const handleSubmit = () => {
    if (!reviewNotes.trim()) {
      alert("Please provide review notes")
      return
    }

    switch (action) {
      case "approve":
        onApprove(reviewNotes)
        break
      case "reject":
        onReject(reviewNotes)
        break
      case "changes":
        onRequestChanges(reviewNotes)
        break
    }

    setReviewNotes("")
    setShowApprovalForm(false)
    setAction(null)
  }

  if (showApprovalForm) {
    return (
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {action === "approve" && "Approve Document"}
              {action === "reject" && "Reject Document"}
              {action === "changes" && "Request Changes"}
            </h3>
            <p className="text-sm text-gray-600">Please provide your review notes</p>
          </div>

          <Textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Enter your review notes, observations, or reasons for this decision..."
            className="w-full h-32 mb-4"
            autoFocus
          />

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowApprovalForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reviewNotes.trim()}
              className={
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : action === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
              }
            >
              Confirm {action === "approve" ? "Approval" : action === "reject" ? "Rejection" : "Request"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          {/* Left: Status & Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Document Review</h3>
                {getStatusBadge()}
              </div>
            </div>

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

            {/* Reviewer Info */}
            {reviewStatus && reviewStatus.reviewer && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Reviewed By</p>
                <p className="text-sm font-medium text-gray-900">
                  {reviewStatus.reviewer}
                  {reviewStatus.reviewedAt && ` • ${new Date(reviewStatus.reviewedAt).toLocaleString()}`}
                </p>
                {reviewStatus.reviewNotes && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{reviewStatus.reviewNotes}"</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="ml-6">
            {locked || status === "approved" ? (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Document is locked</p>
                {onUnlock && (
                  <Button variant="outline" onClick={onUnlock} size="sm">
                    Unlock for Editing
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button onClick={() => handleActionClick("approve")} className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Approve Document
                </Button>
                <Button
                  onClick={() => handleActionClick("reject")}
                  variant="outline"
                  className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Document
                </Button>
                <Button onClick={() => handleActionClick("changes")} variant="outline" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Request Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
