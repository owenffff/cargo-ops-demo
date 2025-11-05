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
import { ArrowLeft, Edit, Eye, Lock, Unlock } from "lucide-react"
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
        // Initialize reviewStatus if not present
        if (!doc.reviewStatus) {
          doc.reviewStatus = {
            status: "pending_review",
            fieldsModified: 0,
            fieldsFlagged: 0,
          }
        }
        setDocument(doc)

        // Set mode from query param (if not locked)
        const queryMode = searchParams.get("mode")
        if (!doc.locked && (queryMode === "edit" || queryMode === "view")) {
          setMode(queryMode)
        } else if (doc.locked) {
          setMode("view")
        }
      }
    }
    setLoading(false)
  }, [params.id, params.docId, searchParams])

  const handleSave = (updatedFields: any) => {
    if (!shipment || !document) return

    // Calculate stats
    const allFields = Object.values(updatedFields)
    const fieldsModified = allFields.filter((f: any) => f.isModified).length
    const fieldsFlagged = allFields.filter((f: any) => f.isFlagged).length
    const avgConfidence = Math.round(
      allFields.reduce((sum: number, field: any) => sum + field.confidence, 0) / allFields.length,
    )

    // Update review status
    const updatedReviewStatus = {
      ...document.reviewStatus,
      status: document.reviewStatus?.status || ("in_review" as const),
      fieldsModified,
      fieldsFlagged,
    }

    // Update document
    LocalStorage.updateDocument(shipment.id, document.id, {
      extractedFields: updatedFields,
      aiConfidenceScore: avgConfidence,
      lastUpdated: new Date().toLocaleString(),
      reviewStatus: updatedReviewStatus,
    })

    // Update local state
    const updatedDoc = {
      ...document,
      extractedFields: updatedFields,
      aiConfidenceScore: avgConfidence,
      lastUpdated: new Date().toLocaleString(),
      reviewStatus: updatedReviewStatus,
    }
    setDocument(updatedDoc)

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Document Updated",
      `Updated extracted fields for document ${document.id} (${document.documentName})`,
    )
  }

  const handleApprove = (notes: string) => {
    if (!shipment || !document) return

    const reviewStatus = {
      status: "approved" as const,
      reviewer: "Ryan",
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes,
      fieldsModified: document.reviewStatus?.fieldsModified || 0,
      fieldsFlagged: document.reviewStatus?.fieldsFlagged || 0,
    }

    LocalStorage.updateDocument(shipment.id, document.id, {
      reviewStatus,
      locked: true,
    })

    setDocument({
      ...document,
      reviewStatus,
      locked: true,
    })
    setMode("view")

    auditTrail.addEntry("Ryan", "Document Approved", `Approved document ${document.id}: ${notes}`)
    toast.success("Document approved successfully")
  }

  const handleReject = (notes: string) => {
    if (!shipment || !document) return

    const reviewStatus = {
      status: "rejected" as const,
      reviewer: "Ryan",
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes,
      fieldsModified: document.reviewStatus?.fieldsModified || 0,
      fieldsFlagged: document.reviewStatus?.fieldsFlagged || 0,
    }

    LocalStorage.updateDocument(shipment.id, document.id, {
      reviewStatus,
    })

    setDocument({
      ...document,
      reviewStatus,
    })

    auditTrail.addEntry("Ryan", "Document Rejected", `Rejected document ${document.id}: ${notes}`)
    toast.error("Document rejected")
  }

  const handleRequestChanges = (notes: string) => {
    if (!shipment || !document) return

    const reviewStatus = {
      status: "in_review" as const,
      reviewer: "Ryan",
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes,
      fieldsModified: document.reviewStatus?.fieldsModified || 0,
      fieldsFlagged: document.reviewStatus?.fieldsFlagged || 0,
    }

    LocalStorage.updateDocument(shipment.id, document.id, {
      reviewStatus,
    })

    setDocument({
      ...document,
      reviewStatus,
    })

    auditTrail.addEntry("Ryan", "Changes Requested", `Requested changes for document ${document.id}: ${notes}`)
    toast.info("Changes requested")
  }

  const handleUnlock = () => {
    if (!shipment || !document) return

    if (!confirm("Are you sure you want to unlock this document? This will allow further edits.")) return

    LocalStorage.updateDocument(shipment.id, document.id, {
      locked: false,
    })

    setDocument({
      ...document,
      locked: false,
    })

    auditTrail.addEntry("Ryan", "Document Unlocked", `Unlocked document ${document.id} for editing`)
    toast.success("Document unlocked")
  }

  const toggleMode = () => {
    if (document?.locked) {
      toast.error("Document is locked. Unlock it first to edit.")
      return
    }
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
              {document.locked && <Lock className="w-5 h-5 text-gray-500" />}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {document.documentType} • AI Confidence: {document.aiConfidenceScore}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            {document.locked && (
              <Button variant="outline" onClick={handleUnlock} className="gap-2">
                <Unlock className="w-4 h-4" />
                Unlock
              </Button>
            )}
            {!document.locked && (
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
            )}
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
              locked={document.locked}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>

      {/* Approval Panel at Bottom */}
      <DocumentApprovalPanel
        reviewStatus={document.reviewStatus}
        extractedFields={document.extractedFields}
        locked={document.locked}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
        onUnlock={handleUnlock}
      />
    </div>
  )
}
