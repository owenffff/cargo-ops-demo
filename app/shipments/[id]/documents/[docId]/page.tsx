"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import type { Shipment, Document } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { auditTrail } from "@/lib/audit-trail"
import { PDFViewer } from "@/components/documents/pdf-viewer"
import { ExtractedFieldsTable } from "@/components/documents/extracted-fields-table"
import { DocumentApprovalPanel } from "@/components/documents/document-approval-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Eye } from "lucide-react"
import { toast } from "sonner"

export default function DocumentViewerPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [document, setDocument] = useState<Document | null>(null)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)

    if (found) {
      setShipment(found)

      // Load document
      const doc = LocalStorage.getDocument(found.id, params.docId as string)
      if (doc) {
        setDocument(doc)

        // Set mode from query param
        const queryMode = searchParams.get("mode")
        if (queryMode === "edit" || queryMode === "view") {
          setMode(queryMode)
        }
      }
    }
    setLoading(false)
  }, [params.id, params.docId, searchParams])

  const handleSave = (updatedFields: any) => {
    if (!shipment || !document) return

    // Calculate stats
    const allFields = Object.values(updatedFields)
    const avgConfidence = Math.round(
      allFields.reduce((sum: number, field: any) => sum + field.confidence, 0) / allFields.length,
    )

    // Update document
    LocalStorage.updateDocument(shipment.id, document.id, {
      extractedFields: updatedFields,
      aiConfidenceScore: avgConfidence,
      lastUpdated: new Date().toLocaleString(),
    })

    // Update local state
    const updatedDoc = {
      ...document,
      extractedFields: updatedFields,
      aiConfidenceScore: avgConfidence,
      lastUpdated: new Date().toLocaleString(),
    }
    setDocument(updatedDoc)

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Document Updated",
      `Updated extracted fields for document ${document.id} (${document.documentName})`,
    )
  }

  const toggleMode = () => {
    const newMode = mode === "view" ? "edit" : "view"
    setMode(newMode)
    router.replace(`/shipments/${params.id}/documents/${params.docId}?mode=${newMode}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!shipment || !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
          <Button onClick={() => router.push(`/shipments/${params.id}/validation`)}>
            Return to Validation Page
          </Button>
        </div>
      </div>
    )
  }

  if (!document.extractedFields || !document.fileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Processed</h2>
          <p className="text-gray-600 mb-4">This document hasn't been processed yet.</p>
          <Button onClick={() => router.push(`/shipments/${params.id}/validation`)}>
            Return to Validation Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <button onClick={() => router.push("/")} className="hover:text-gray-900">
                Shipment
              </button>
              <span>/</span>
              <button onClick={() => router.push(`/shipments/${shipment.id}`)} className="hover:text-gray-900">
                Shipment {shipment.shipmentNumber}
              </button>
              <span>/</span>
              <button onClick={() => router.push(`/shipments/${shipment.id}/validation`)} className="hover:text-gray-900">
                Validation
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">{document.documentName}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{document.documentName}</h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {document.documentType} • AI Confidence: {document.aiConfidenceScore}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={toggleMode} className="gap-2">
              {mode === "view" ? (
                <>
                  <Edit className="w-4 h-4" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  View Mode
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/shipments/${shipment.id}/validation`)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Validation
            </Button>
          </div>
        </div>
      </div>

      {/* Side-by-side Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="w-1/2 border-r border-gray-200">
          <PDFViewer fileData={document.fileData} fileName={`${document.documentName}.pdf`} />
        </div>

        {/* Right: Extracted Fields */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ExtractedFieldsTable
              fields={document.extractedFields}
              mode={mode}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>

      {/* Statistics Panel at Bottom */}
      <DocumentApprovalPanel extractedFields={document.extractedFields} />

      {/* Audit Log Section */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Audit Log</h2>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Edited By</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Original Data Field</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Edited Data Field</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {auditTrail.getEntries()
                  .filter(entry => entry.details.includes(document.id) || entry.details.includes(document.documentName))
                  .slice(0, 10)
                  .map((entry, index) => {
                    const date = new Date(entry.timestamp)
                    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                    const dateStr = date.toLocaleDateString('en-GB')

                    return (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="text-blue-600 font-medium">{entry.user}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-blue-600">
                            {entry.action === "Document Updated" ? "Previous field values" : entry.action}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-blue-600">
                            {entry.details}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{timeStr}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{dateStr}</td>
                      </tr>
                    )
                  })}
                {auditTrail.getEntries().filter(entry => entry.details.includes(document.id) || entry.details.includes(document.documentName)).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                      No audit entries found for this document
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
