"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, ManifestData, ManifestComment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { mockBillsOfLading } from "@/lib/mock-data"
import { generateMockCargoItems, generateMockManifest } from "@/lib/mock-cargo"
import { auditTrail } from "@/lib/audit-trail"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ManifestForm } from "@/components/manifest/manifest-form"
import { CommentHistory } from "@/components/manifest/comment-history"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Send, FileText } from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { StatusChip } from "@/components/status-chip"

export default function ManifestPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [manifest, setManifest] = useState<ManifestData | null>(null)
  const [newComment, setNewComment] = useState("")
  const [toast, setToast] = useState<{ show: boolean; variant: any; title: string; description: string }>({
    show: false,
    variant: "info",
    title: "",
    description: "",
  })

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)

    if (found) {
      setShipment(found)

      // Generate manifest
      const bills = mockBillsOfLading[found.id] || []
      const blNumbers = bills.map((b) => b.blNumber)
      const items = generateMockCargoItems(found.id, blNumbers)
      const generatedManifest = generateMockManifest(found.id, items)
      setManifest(generatedManifest)
    }
  }, [params.id])

  const handleAddComment = () => {
    if (!manifest || !newComment.trim()) return

    const comment: ManifestComment = {
      id: `comment-${Date.now()}`,
      user: "Ryan",
      comment: newComment,
      timestamp: new Date().toLocaleString(),
      action: "comment",
    }

    setManifest({
      ...manifest,
      comments: [...manifest.comments, comment],
    })

    setNewComment("")
    showToast("success", "Comment Added", "Your comment has been added to the manifest")
  }

  const handleSubmitToPortNet = () => {
    if (!shipment || !manifest) return

    // Update manifest status
    const updatedManifest = {
      ...manifest,
      status: "submitted" as const,
      submittedAt: new Date().toISOString(),
    }
    setManifest(updatedManifest)

    // Update shipment status
    const shipments = LocalStorage.getShipments()
    const updated = shipments.map((s) =>
      s.id === shipment.id
        ? {
            ...s,
            status: "portnet-submission" as const,
            stages: { ...s.stages, portnetSubmission: true },
          }
        : s,
    )
    LocalStorage.setShipments(updated)

    // Add audit entry
    auditTrail.addEntry("Ryan", "Manifest Submitted", `Submitted manifest ${manifest.manifestNumber} to PortNet`)

    showToast("success", "Manifest Submitted", "Manifest has been submitted to PortNet")

    setTimeout(() => {
      router.push(`/shipments/${shipment.id}`)
    }, 2000)
  }

  const handleDownloadManifest = () => {
    if (!manifest) return

    // Mock download - in real app would generate actual file
    showToast("info", "Download Started", "Manifest file is being prepared")

    // Add audit entry
    auditTrail.addEntry("Ryan", "Manifest Downloaded", `Downloaded manifest ${manifest.manifestNumber}`)
  }

  const showToast = (variant: any, title: string, description: string) => {
    setToast({ show: true, variant, title, description })
    setTimeout(() => setToast({ show: false, variant: "info", title: "", description: "" }), 3000)
  }

  if (!shipment || !manifest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 right-6 z-50">
          <Toast variant={toast.variant} title={toast.title} description={toast.description} />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => router.push("/")} className="hover:text-gray-900">
            Shipment
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/shipments/${shipment.id}`)} className="hover:text-gray-900">
            Shipment {shipment.shipmentNumber}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Cargo Manifest</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStatus={shipment.status} stages={shipment.stages} shipmentId={shipment.id} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push(`/shipments/${shipment.id}`)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shipment
          </Button>
        </div>

        {/* Manifest Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cargo Manifest</h1>
                <p className="text-sm text-gray-600">Manifest Number: {manifest.manifestNumber}</p>
              </div>
            </div>
            <StatusChip
              status={
                manifest.status === "submitted" ? "completed" : manifest.status === "rejected" ? "rejected" : "pending"
              }
              label={manifest.status.charAt(0).toUpperCase() + manifest.status.slice(1)}
            />
          </div>
        </div>

        {/* Manifest Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manifest Details</h2>
          <ManifestForm manifest={manifest} onChange={setManifest} readOnly={manifest.status === "submitted"} />
        </div>

        {/* Cargo Items Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cargo Items Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Cargo Items</p>
              <p className="text-2xl font-bold text-gray-900">{manifest.cargoItems.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{manifest.totalUnits}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Weight</p>
              <p className="text-2xl font-bold text-gray-900">{manifest.totalWeight.toLocaleString()} kg</p>
            </div>
          </div>
        </div>

        {/* Comment History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comment History</h2>
          <CommentHistory comments={manifest.comments} />

          {manifest.status !== "submitted" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
                Add Comment
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleDownloadManifest} className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download Manifest
          </Button>
          {manifest.status === "draft" && (
            <Button onClick={handleSubmitToPortNet} className="gap-2">
              <Send className="w-4 h-4" />
              Submit to PortNet
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
