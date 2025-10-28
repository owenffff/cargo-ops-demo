"use client"

import { FileText, Mail, Upload, Download, Eye, Calendar, CheckCircle2, AlertCircle } from "lucide-react"
import { ConfidenceBar } from "@/components/confidence-bar"
import type { Document } from "@/types"

interface DocumentCardProps {
  document: Document & {
    source?: "email" | "manual"
    emailFrom?: string
    extractedAt?: string
  }
  shipmentNumber: string
  onView?: () => void
  onDownload?: () => void
}

export function DocumentCard({ document, shipmentNumber, onView, onDownload }: DocumentCardProps) {
  const isLowConfidence = document.aiConfidenceScore < 85
  const source = document.source || "email"

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${isLowConfidence ? "bg-orange-50" : "bg-blue-50"}`}>
            <FileText className={`w-5 h-5 ${isLowConfidence ? "text-orange-600" : "text-blue-600"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{document.documentName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{document.documentType}</span>
              <span className="text-xs text-gray-500">Shipment {shipmentNumber}</span>
            </div>
          </div>
        </div>

        {/* Source indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
            source === "email" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {source === "email" ? <Mail className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
          {source === "email" ? "Email" : "Manual"}
        </div>
      </div>

      {/* AI Confidence Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">AI Confidence Score</span>
          <span className="text-xs font-medium text-gray-900">{document.aiConfidenceScore}%</span>
        </div>
        <ConfidenceBar score={document.aiConfidenceScore} />
        {isLowConfidence && (
          <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
            <AlertCircle className="w-3 h-3" />
            <span>Low confidence - manual review recommended</span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
        {source === "email" && document.emailFrom && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate">From: {document.emailFrom}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>Last updated: {document.lastUpdated}</span>
        </div>
        {document.numberOfUnits && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle2 className="w-3 h-3" />
            <span>{document.numberOfUnits} units</span>
          </div>
        )}
        {document.extractedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle2 className="w-3 h-3" />
            <span>Extracted: {document.extractedAt}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  )
}
