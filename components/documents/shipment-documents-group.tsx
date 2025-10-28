"use client"

import { Ship, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { DocumentCard } from "./document-card"
import type { Document } from "@/types"

interface ShipmentDocumentsGroupProps {
  shipmentNumber: string
  vesselName: string
  documents: (Document & {
    source?: "email" | "manual"
    emailFrom?: string
    extractedAt?: string
  })[]
  defaultExpanded?: boolean
}

export function ShipmentDocumentsGroup({
  shipmentNumber,
  vesselName,
  documents,
  defaultExpanded = true,
}: ShipmentDocumentsGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const emailDocs = documents.filter((d) => d.source === "email")
  const manualDocs = documents.filter((d) => d.source === "manual")
  const avgConfidence = Math.round(documents.reduce((sum, d) => sum + d.aiConfidenceScore, 0) / documents.length)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
          <div className="p-2 bg-blue-50 rounded-lg">
            <Ship className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Shipment {shipmentNumber}</h3>
            <p className="text-sm text-gray-600">{vesselName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{documents.length} documents</div>
            <div className="text-xs text-gray-500">Avg confidence: {avgConfidence}%</div>
          </div>
          <div className="flex gap-2">
            {emailDocs.length > 0 && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                {emailDocs.length} from email
              </span>
            )}
            {manualDocs.length > 0 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{manualDocs.length} manual</span>
            )}
          </div>
        </div>
      </button>

      {/* Documents Grid */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                shipmentNumber={shipmentNumber}
                onView={() => console.log("View", doc.id)}
                onDownload={() => console.log("Download", doc.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
