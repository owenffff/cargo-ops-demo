"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, Document, BillOfLading } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { mockDocuments, mockBillsOfLading, mockCargoAllocationPlan } from "@/lib/mock-data"
import { mockExtractDocument, generateExtractedBLFields } from "@/lib/mock-extract"
import { auditTrail } from "@/lib/audit-trail"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { UploadModal } from "@/components/upload/upload-modal"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ValidationPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [bills, setBills] = useState<BillOfLading[]>([])
  const [cargoAllocationPlan, setCargoAllocationPlan] = useState<any>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"BL" | "BL_LIST" | "VIN_LIST">("BL")
  const [validationStatus, setValidationStatus] = useState<"pending" | "mismatch" | "match">("pending")
  const [processingDocId, setProcessingDocId] = useState<string | null>(null)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)

    if (found) {
      setShipment(found)

      // Load or initialize documents
      let storedDocs = LocalStorage.getDocuments(found.id)
      if (storedDocs.length === 0 && mockDocuments[found.id]) {
        storedDocs = mockDocuments[found.id]
        LocalStorage.setDocuments(found.id, storedDocs)
      }
      setDocuments(storedDocs)

      // Load bills
      if (mockBillsOfLading[found.id]) {
        setBills(mockBillsOfLading[found.id])
      }

      // Load cargo allocation plan
      if (mockCargoAllocationPlan[found.id]) {
        setCargoAllocationPlan(mockCargoAllocationPlan[found.id])
      }

      // Check validation status
      checkValidationStatus(storedDocs, mockCargoAllocationPlan[found.id])
    }
  }, [params.id])

  const checkValidationStatus = (docs: Document[], cap: any) => {
    if (!cap) {
      setValidationStatus("pending")
      return
    }

    const totalBLUnits = docs.reduce((sum, doc) => sum + (doc.numberOfUnits || 0), 0)
    if (totalBLUnits === cap.totalUnits) {
      setValidationStatus("match")
    } else {
      setValidationStatus("mismatch")
    }
  }

  const handleUpload = async (files: File[]) => {
    if (!shipment) return

    // Convert files to base64 and create document entries with "uploaded" status
    const newDocs: Document[] = await Promise.all(
      files.map(async (file, index) => {
        // Convert file to base64
        const reader = new FileReader()
        const fileData = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        return {
          id: `doc-${Date.now()}-${index}`,
          shipmentId: shipment.id,
          documentName: file.name.replace(/\.[^/.]+$/, ""),
          documentType: uploadType,
          aiConfidenceScore: 0, // Not yet processed
          lastUpdated: new Date().toLocaleString(),
          numberOfUnits: 0,
          processingStatus: "uploaded" as const,
          fileData,
        }
      }),
    )

    const updatedDocs = [...documents, ...newDocs]
    setDocuments(updatedDocs)
    LocalStorage.setDocuments(shipment.id, updatedDocs)

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Document Upload",
      `Uploaded ${files.length} ${uploadType} document(s) for shipment ${shipment.id}`,
    )

    // Show success toast
    toast.success(`${files.length} document(s) uploaded successfully`)
  }

  const handleStartAIProcessing = async (docId: string) => {
    if (!shipment) return

    setProcessingDocId(docId)

    // Update status to "processing"
    LocalStorage.updateDocument(shipment.id, docId, { processingStatus: "processing" })
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, processingStatus: "processing" as const } : doc,
    )
    setDocuments(updatedDocs)

    // Add audit entry
    auditTrail.addEntry("Ryan", "AI Processing Started", `Started AI processing for document ${docId}`)

    // Simulate 5 second AI processing
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Generate extracted fields
    const extractedFields = generateExtractedBLFields(docId, shipment.id)
    const avgConfidence = Math.round(
      Object.values(extractedFields).reduce((sum, field) => sum + field.confidence, 0) /
        Object.values(extractedFields).length,
    )

    // Update document with extracted fields and "ready" status
    const processedDoc = {
      processingStatus: "ready" as const,
      extractedFields,
      aiConfidenceScore: avgConfidence,
      numberOfUnits: parseInt(extractedFields.numberOfPackages.value.replace(/[^0-9]/g, "")) || 0,
      lastUpdated: new Date().toLocaleString(),
    }

    LocalStorage.updateDocument(shipment.id, docId, processedDoc)
    const finalDocs = documents.map((doc) => (doc.id === docId ? { ...doc, ...processedDoc } : doc))
    setDocuments(finalDocs)
    setProcessingDocId(null)

    // Add audit entry
    auditTrail.addEntry("Ryan", "AI Processing Complete", `Completed AI processing for document ${docId}`)

    // Check validation
    checkValidationStatus(finalDocs, cargoAllocationPlan)

    toast.success("AI processing completed", { description: `Document ready for review (${avgConfidence}% confidence)` })
  }

  const handleDeleteDocument = (docId: string) => {
    if (!shipment) return

    if (!confirm("Are you sure you want to delete this document?")) return

    LocalStorage.deleteDocument(shipment.id, docId)
    const updatedDocs = documents.filter((doc) => doc.id !== docId)
    setDocuments(updatedDocs)

    // Add audit entry
    auditTrail.addEntry("Ryan", "Document Deleted", `Deleted document ${docId} from shipment ${shipment.id}`)

    // Check validation
    checkValidationStatus(updatedDocs, cargoAllocationPlan)

    toast.success("Document deleted successfully")
  }

  const handleMarkReady = () => {
    if (!shipment) return

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
    auditTrail.addEntry("Ryan", "Validation Complete", `Marked shipment ${shipment.id} ready for PortNet submission`)

    toast.success("Validation Complete", { description: "Shipment marked ready for PortNet submission" })

    setTimeout(() => {
      router.push(`/shipments/${shipment.id}`)
    }, 1500)
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const totalBLUnits = documents
    .filter((doc) => doc.processingStatus === "ready")
    .reduce((sum, doc) => sum + (doc.numberOfUnits || 0), 0)
  const lowConfidenceDocs = documents.filter((doc) => doc.aiConfidenceScore < 95 && doc.processingStatus === "ready")

  return (
    <div className="min-h-screen bg-gray-50">

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
          <span className="text-gray-900 font-medium">Validation</span>
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

        <ShipmentDetailsCard shipment={shipment} />

        {/* Cargo Allocation Plan */}
        <div className="mt-6">
        {cargoAllocationPlan && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cargo Allocation Plan</h2>
              <Button variant="outline" size="sm">
                View Audit Trail
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                AI confidence score = {cargoAllocationPlan.aiConfidenceScore}%
              </p>
              <div className="max-w-md">
                <ConfidenceBar score={cargoAllocationPlan.aiConfidenceScore} />
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Document Name</p>
                  <p className="font-medium text-gray-900">{cargoAllocationPlan.documentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Num of Units</p>
                  <p className="font-medium text-gray-900 text-center">{cargoAllocationPlan.totalUnits}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                    View
                  </Button>
                  <span className="text-gray-300">|</span>
                  <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                    Edit
                  </Button>
                  <span className="text-gray-300">|</span>
                  <Button variant="link" size="sm" className="text-red-600 p-0 h-auto">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill of Lading */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bill of Lading</h2>
              <p className="text-sm text-gray-600">uploaded {documents.length} files</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Audit Trail
              </Button>
              <Button
                onClick={() => {
                  setUploadType("BL")
                  setUploadModalOpen(true)
                }}
                size="sm"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
          </div>

          {lowConfidenceDocs.length > 0 && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Pending Review</p>
                <p className="text-sm text-amber-800">
                  {lowConfidenceDocs.length} document(s) have confidence scores below 95%. Please review and verify before proceeding.
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Document Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Processing Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">AI Confidence Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Last Updated</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents
                  .filter((doc) => doc.documentType === "BL")
                  .map((doc) => {
                    const status = doc.processingStatus || "ready"
                    const isProcessing = processingDocId === doc.id

                    return (
                      <tr key={doc.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{doc.documentName}</td>
                        <td className="py-3 px-4">
                          {status === "uploaded" && (
                            <Button
                              size="sm"
                              onClick={() => handleStartAIProcessing(doc.id)}
                              disabled={isProcessing}
                              className="gap-2"
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Start AI Processing"
                              )}
                            </Button>
                          )}
                          {status === "processing" && (
                            <span className="flex items-center gap-2 text-sm text-blue-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </span>
                          )}
                          {status === "ready" && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                              Ready for Review
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {status === "ready" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className={`h-full ${doc.aiConfidenceScore >= 95 ? "bg-green-500" : "bg-amber-500"}`}
                                  style={{ width: `${doc.aiConfidenceScore}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900">{doc.aiConfidenceScore}%</span>
                              {doc.aiConfidenceScore < 95 && (
                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                  Pending Review
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{doc.lastUpdated}</td>
                        <td className="py-3 px-4">
                          {status === "ready" ? (
                            <div className="flex gap-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-blue-600 p-0 h-auto"
                                onClick={() => router.push(`/shipments/${shipment.id}/documents/${doc.id}?mode=view`)}
                              >
                                View
                              </Button>
                              <span className="text-gray-300">|</span>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-blue-600 p-0 h-auto"
                                onClick={() => router.push(`/shipments/${shipment.id}/documents/${doc.id}?mode=edit`)}
                              >
                                Edit
                              </Button>
                              <span className="text-gray-300">|</span>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-red-600 p-0 h-auto"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-red-600 p-0 h-auto"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Validate Cargo Allocation Plan against Bill of Lading
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Cargo Allocation Plan</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{cargoAllocationPlan?.totalUnits || 0}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Bill of Ladings</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{totalBLUnits}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                {validationStatus === "match" ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Units tally</p>
                  </div>
                ) : validationStatus === "mismatch" ? (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <p className="text-sm font-medium text-red-700">Mismatch in units</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">Pending validation</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setUploadType("BL")
                setUploadModalOpen(true)
              }}
            >
              Upload Document
            </Button>
            <Button variant="outline">Request updated BL</Button>
            <Button onClick={handleMarkReady} disabled={validationStatus !== "match"}>
              Next
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        title={`Upload ${uploadType === "BL" ? "Bill of Lading" : uploadType === "BL_LIST" ? "BL List" : "VIN List"}`}
      />
    </div>
  )
}
