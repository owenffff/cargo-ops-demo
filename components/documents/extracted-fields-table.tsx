"use client"

import { useState, useRef } from "react"
import type { ExtractedBLFields, ExtractedBLField } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  AlertCircle,
  Save,
  Flag,
  MessageSquare,
  RotateCcw,
  Filter,
  Edit,
} from "lucide-react"
import { toast } from "sonner"
import { FieldReviewTooltip } from "./field-review-tooltip"
import { FieldCommentModal } from "./field-comment-modal"

interface ExtractedFieldsTableProps {
  fields: ExtractedBLFields
  mode: "view" | "edit"
  locked?: boolean
  onSave?: (updatedFields: ExtractedBLFields) => void
}

type FilterType = "all" | "modified" | "flagged"

export function ExtractedFieldsTable({ fields, mode, locked, onSave }: ExtractedFieldsTableProps) {
  const [editedFields, setEditedFields] = useState<ExtractedBLFields>(fields)
  const [hasChanges, setHasChanges] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")
  const [tooltipField, setTooltipField] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [commentModalField, setCommentModalField] = useState<string | null>(null)
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({})

  const handleFieldChange = (fieldKey: keyof ExtractedBLFields, newValue: string) => {
    setEditedFields((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        value: newValue,
        isModified: newValue !== prev[fieldKey].originalValue,
        modifiedBy: "Ryan",
        modifiedAt: new Date().toISOString(),
      },
    }))
    setHasChanges(true)
  }

  const handleToggleFlag = (fieldKey: keyof ExtractedBLFields) => {
    setEditedFields((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        isFlagged: !prev[fieldKey].isFlagged,
      },
    }))
    setHasChanges(true)
    toast.success(editedFields[fieldKey].isFlagged ? "Flag removed" : "Field flagged for review")
  }

  const handleAddComment = (fieldKey: string, comment: string) => {
    const field = fieldKey as keyof ExtractedBLFields
    const newComment = {
      id: `comment-${Date.now()}`,
      user: "Ryan",
      comment,
      timestamp: new Date().toISOString(),
    }

    setEditedFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        comments: [...prev[field].comments, newComment],
      },
    }))
    setHasChanges(true)
    toast.success("Comment added")
  }

  const handleRevertField = (fieldKey: string) => {
    const field = fieldKey as keyof ExtractedBLFields
    setEditedFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: prev[field].originalValue,
        isModified: false,
        modifiedBy: undefined,
        modifiedAt: undefined,
      },
    }))
    setHasChanges(true)
    setTooltipField(null)
    toast.success("Field reverted to original value")
  }

  const handleRevertAll = () => {
    if (!confirm("Are you sure you want to revert all changes?")) return

    const reverted = Object.keys(editedFields).reduce((acc, key) => {
      const fieldKey = key as keyof ExtractedBLFields
      acc[fieldKey] = {
        ...editedFields[fieldKey],
        value: editedFields[fieldKey].originalValue,
        isModified: false,
        modifiedBy: undefined,
        modifiedAt: undefined,
      }
      return acc
    }, {} as ExtractedBLFields)

    setEditedFields(reverted)
    setHasChanges(true)
    toast.success("All changes reverted")
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedFields)
      setHasChanges(false)
      toast.success("Changes saved successfully")
    }
  }

  const handleMouseEnter = (fieldKey: string, event: React.MouseEvent<HTMLTableRowElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.right + 10,
    })
    setTooltipField(fieldKey)
  }

  const handleMouseLeave = () => {
    setTooltipField(null)
  }

  const renderField = (fieldKey: keyof ExtractedBLFields, field: ExtractedBLField) => {
    const isLowConfidence = field.confidence < 95
    const isMultiline =
      fieldKey === "shipperExporter" ||
      fieldKey === "consignee" ||
      fieldKey === "notifyParty" ||
      fieldKey === "marksAndNumbers" ||
      fieldKey === "descriptionOfGoods"

    // Apply filter
    if (filter === "modified" && !field.isModified) return null
    if (filter === "flagged" && !field.isFlagged) return null

    const isEditable = mode === "edit" && field.editable && !locked

    return (
      <tr
        key={fieldKey}
        ref={(el) => (rowRefs.current[fieldKey] = el)}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        onMouseEnter={(e) => handleMouseEnter(fieldKey, e)}
        onMouseLeave={handleMouseLeave}
      >
        <td className="py-3 px-4 text-sm font-medium text-gray-700 w-1/4">
          <div className="flex items-center gap-2">
            <span>{field.label}</span>
            {field.isModified && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">edited</span>
            )}
            {field.isFlagged && <Flag className="w-3 h-3 text-red-600 fill-red-600" />}
            {field.comments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="w-3 h-3" />
                {field.comments.length}
              </span>
            )}
          </div>
        </td>
        <td className="py-3 px-4 w-1/2">
          {isEditable ? (
            isMultiline ? (
              <Textarea
                value={editedFields[fieldKey].value}
                onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                className="w-full text-sm"
                rows={3}
              />
            ) : (
              <Input
                value={editedFields[fieldKey].value}
                onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                className="w-full text-sm"
              />
            )
          ) : (
            <span className="text-sm text-gray-900">{field.value}</span>
          )}
        </td>
        <td className="py-3 px-4 w-1/6">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
              <div
                className={`h-full ${isLowConfidence ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${field.confidence}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{field.confidence}%</span>
            {isLowConfidence ? (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleFlag(fieldKey)}
              className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${field.isFlagged ? "text-red-600" : "text-gray-400"}`}
              title={field.isFlagged ? "Remove flag" : "Flag for review"}
              disabled={locked}
            >
              <Flag className={`w-4 h-4 ${field.isFlagged ? "fill-red-600" : ""}`} />
            </button>
            <button
              onClick={() => setCommentModalField(fieldKey)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
              title="Add comment"
              disabled={locked}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            {field.isModified && (
              <button
                onClick={() => handleRevertField(fieldKey)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                title="Revert to original"
                disabled={locked}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
    )
  }

  const allFields = Object.values(editedFields)
  const avgConfidence = Math.round(
    allFields.reduce((sum, field) => sum + field.confidence, 0) / allFields.length,
  )
  const lowConfidenceCount = allFields.filter((field) => field.confidence < 95).length
  const modifiedCount = allFields.filter((field) => field.isModified).length
  const flaggedCount = allFields.filter((field) => field.isFlagged).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Extracted Fields
              {mode === "edit" && !locked && <Edit className="w-4 h-4 text-blue-600" />}
              {locked && <span className="text-sm font-normal text-gray-500">(Locked)</span>}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>
                Average Confidence: <span className="font-medium text-gray-900">{avgConfidence}%</span>
              </span>
              <span>•</span>
              <span>
                Modified: <span className="font-medium text-blue-700">{modifiedCount}</span>
              </span>
              <span>•</span>
              <span>
                Flagged: <span className="font-medium text-red-700">{flaggedCount}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {modifiedCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleRevertAll} disabled={locked} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Revert All
              </Button>
            )}
            {mode === "edit" && !locked && (
              <Button onClick={handleSave} disabled={!hasChanges} size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded transition-colors ${filter === "all" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
          >
            All ({allFields.length})
          </button>
          <button
            onClick={() => setFilter("modified")}
            className={`px-3 py-1 text-sm rounded transition-colors ${filter === "modified" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Modified ({modifiedCount})
          </button>
          <button
            onClick={() => setFilter("flagged")}
            className={`px-3 py-1 text-sm rounded transition-colors ${filter === "flagged" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Flagged ({flaggedCount})
          </button>
        </div>

        {lowConfidenceCount > 0 && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Low Confidence Fields</p>
              <p className="text-sm text-amber-800">
                {lowConfidenceCount} field{lowConfidenceCount > 1 ? "s" : ""} have confidence scores below 95%. Please
                review and verify before proceeding.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Field Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Value
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                AI Confidence
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Parties */}
            <tr className="bg-gray-100">
              <td colSpan={4} className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase">
                Parties
              </td>
            </tr>
            {renderField("blNo", editedFields.blNo)}
            {renderField("shipperExporter", editedFields.shipperExporter)}
            {renderField("consignee", editedFields.consignee)}
            {renderField("notifyParty", editedFields.notifyParty)}

            {/* Vessel Details */}
            <tr className="bg-gray-100">
              <td colSpan={4} className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase">
                Vessel Details
              </td>
            </tr>
            {renderField("oceanVessel", editedFields.oceanVessel)}
            {renderField("voyageNo", editedFields.voyageNo)}
            {renderField("portOfLoading", editedFields.portOfLoading)}
            {renderField("portOfDischarge", editedFields.portOfDischarge)}

            {/* Cargo Details */}
            <tr className="bg-gray-100">
              <td colSpan={4} className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase">
                Cargo Details
              </td>
            </tr>
            {renderField("marksAndNumbers", editedFields.marksAndNumbers)}
            {renderField("descriptionOfGoods", editedFields.descriptionOfGoods)}
            {renderField("numberOfPackages", editedFields.numberOfPackages)}
            {renderField("grossWeight", editedFields.grossWeight)}
            {renderField("measurement", editedFields.measurement)}

            {/* Additional Information */}
            <tr className="bg-gray-100">
              <td colSpan={4} className="py-2 px-4 text-xs font-semibold text-gray-700 uppercase">
                Additional Information
              </td>
            </tr>
            {renderField("freightPrepaidAt", editedFields.freightPrepaidAt)}
            {renderField("dateOfIssue", editedFields.dateOfIssue)}
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {tooltipField && (
        <div
          className="fixed z-50"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <FieldReviewTooltip
            field={editedFields[tooltipField as keyof ExtractedBLFields]}
            fieldKey={tooltipField}
            onRevert={handleRevertField}
          />
        </div>
      )}

      {/* Comment Modal */}
      {commentModalField && (
        <FieldCommentModal
          isOpen={true}
          field={editedFields[commentModalField as keyof ExtractedBLFields]}
          fieldKey={commentModalField}
          onClose={() => setCommentModalField(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  )
}
