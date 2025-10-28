"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, Document } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { mockExtractDocument } from "@/lib/mock-extract"
import { auditTrail } from "@/lib/audit-trail"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { UploadModal } from "@/components/upload/upload-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Upload, Mail } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Toast } from "@/components/ui/toast"

export default function PortNetSubmissionPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"BL" | "BL_LIST" | "VIN_LIST" | "MANIFEST" | "PORTNET">("MANIFEST")
  const [toast, setToast] = useState<{ show: boolean; variant: any; title: string; description: string }>({
    show: false,
    variant: "info",
    title: "",
    description: "",
  })

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)
    if (found) setShipment(found)
  }, [params.id])

  const handleUpload = (files: File[]) => {
    if (!shipment) return

    // Mock file processing
    const newDocs: Document[] = files.map((file, index) => {
      const extracted = mockExtractDocument(uploadType, file.name)

      return {
        id: `doc-${Date.now()}-${index}`,
        shipmentId: shipment.id,
        documentName: file.name.replace(/\.[^/.]+$/, ""),
        documentType: uploadType,
        aiConfidenceScore: extracted.confidence || 100,
        lastUpdated: new Date().toLocaleString(),
        numberOfUnits: extracted.numberOfUnits || Math.floor(Math.random() * 10) + 1,
      }
    })

    // Get existing documents and add new ones
    const existingDocs = LocalStorage.getDocuments(shipment.id)
    const updatedDocs = [...existingDocs, ...newDocs]
    LocalStorage.setDocuments(shipment.id, updatedDocs)

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Ad-hoc Document Upload",
      `Uploaded ${files.length} ${uploadType} document(s) for shipment ${shipment.id} in PortNet Submission stage`,
    )

    // Show success toast
    showToast("success", "Upload Successful", `${files.length} document(s) uploaded successfully`)
  }

  const showToast = (variant: any, title: string, description: string) => {
    setToast({ show: true, variant, title, description })
    setTimeout(() => setToast({ show: false, variant: "info", title: "", description: "" }), 3000)
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const cargoDetails = {
    numberOfCargoUnits: 50,
    numberOfCar: 20,
    numberOfTrucks: 20,
    numberOfOthers: 10,
    totalWeight: "700 Kg",
  }

  const cargoClassificationData = [
    {
      blNo: "HDGLNS50634447",
      cargoType: { value: "Car", confidence: 100 },
      originDestination: { value: "CHINA → SINGAPORE", confidence: 100 },
      cargoStatus: { value: "Local", confidence: 100 },
    },
    {
      blNo: "HDGLNS50634587",
      cargoType: { value: "Car", confidence: 100 },
      originDestination: { value: "CHINA → SINGAPORE", confidence: 100 },
      cargoStatus: { value: "Local", confidence: 100 },
    },
    {
      blNo: "HDGLNS50634571",
      cargoType: { value: "Car", confidence: 100 },
      originDestination: { value: "VIETNAM → SINGAPORE", confidence: 100 },
      cargoStatus: { value: "Transshipment", confidence: 100 },
    },
    {
      blNo: "HDGLKRAU0635582",
      cargoType: { value: "Truck", confidence: 100 },
      originDestination: { value: "KOREA → SINGAPORE", confidence: 100 },
      cargoStatus: { value: "Local", confidence: 100 },
    },
    {
      blNo: "HDGLKRBN0635738",
      cargoType: { value: "Other", confidence: 100 },
      originDestination: { value: "KOREA → SINGAPORE", confidence: 100 },
      cargoStatus: { value: "Entertainment", confidence: 95 },
    },
  ]

  const blValidationData = [
    {
      blNo: "HDGLNS50634447",
      blListMatch: 100,
      vinListMatch: 100,
    },
    {
      blNo: "HDGLNS50634587",
      blListMatch: 100,
      vinListMatch: 100,
    },
    {
      blNo: "HDGLNS50634571",
      blListMatch: 100,
      vinListMatch: 100,
    },
    {
      blNo: "HDGLKRAU0635582",
      blListMatch: 100,
      vinListMatch: 100,
    },
    {
      blNo: "HDGLKRBN0635738",
      blListMatch: 100,
      vinListMatch: 100,
    },
  ]

  const manifestFields = [
    { label: "Vessel Name", value: "Pacific Glory" },
    { label: "Voyage Number", value: "V007" },
    { label: "Port of Loading", value: "Shanghai, China" },
    { label: "Port of Discharge", value: "Singapore" },
    { label: "ETA", value: "1st October 2025" },
    { label: "Total Cargo Units", value: "50" },
    { label: "Total Weight", value: "700 Kg" },
    { label: "Manifest Number", value: "MAN-2025-004-001" },
    { label: "Generated By", value: "AI System" },
    { label: "Reviewed By", value: "Ryan (Admin)" },
  ]

  const ediSubmissionData = {
    submittedAt: "2025-08-15 14:30:00",
    portnetReference: "PN-SG-2025-08-15-004",
    status: "Acknowledged",
    ediMessageId: "EDI-MSG-2025-004-001",
    acknowledgmentTime: "2025-08-15 14:32:15",
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
          <Link href="/" className="hover:text-gray-900">
            Shipment
          </Link>
          <span>/</span>
          <Link href={`/shipments/${shipment.id}`} className="hover:text-gray-900">
            Shipment {shipment.shipmentNumber}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">PortNet Submission</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStatus={shipment.status} stages={shipment.stages} shipmentId={shipment.id} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push(`/shipments/${shipment.id}`)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shipment
          </Button>
          <Button
            onClick={() => {
              setUploadType("MANIFEST")
              setUploadModalOpen(true)
            }}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
            2
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">PortNet Submission</h1>
            <p className="text-sm text-gray-700">
              In cargo manifest generation page, AI will assist to populate the fields and generate flat file for EDI
              PortNet submission after user review
            </p>
          </div>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {/* Cargo Details Section */}
          <AccordionItem value="cargo-details" className="bg-white rounded-lg border border-gray-200">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Cargo Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 font-medium">
                  Cargo Details Statistics - Summary of all cargo units extracted from BL List and VIN List. This data
                  is used to verify cargo allocation and generate the manifest.
                </p>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Number of Cargo Units</p>
                  <p className="text-2xl font-bold text-gray-900">{cargoDetails.numberOfCargoUnits}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Number of Car</p>
                  <p className="text-2xl font-bold text-gray-900">{cargoDetails.numberOfCar}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Number of Trucks</p>
                  <p className="text-2xl font-bold text-gray-900">{cargoDetails.numberOfTrucks}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Number of Others</p>
                  <p className="text-2xl font-bold text-gray-900">{cargoDetails.numberOfOthers}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Weight</p>
                  <p className="text-2xl font-bold text-gray-900">{cargoDetails.totalWeight}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Cargo Classification Section */}
          <AccordionItem value="cargo-classification" className="bg-white rounded-lg border border-gray-200">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">AI Cargo Classification</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-900 font-medium">
                  AI Confidence Scores - AI classifies cargo type based on BL data, tracks, and photos. The green bars
                  indicate high confidence in the classification.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">BL No.</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Cargo Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Origin + Destination</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Cargo Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargoClassificationData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.blNo}</td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">{item.cargoType.value}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${item.cargoType.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{item.cargoType.confidence}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">{item.originDestination.value}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${item.originDestination.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{item.originDestination.confidence}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">{item.cargoStatus.value}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${item.cargoStatus.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{item.cargoStatus.confidence}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* BL Validation Section */}
          <AccordionItem value="bl-validation" className="bg-white rounded-lg border border-gray-200">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">Validate BL against BL List/VIN List</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-900 font-medium">
                  AI Confidence Scores (Validation) - Compare each BL against the BL List and VIN List. The green bar
                  means the information matches, confirming data consistency.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">BL No.</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        AI Match Score
                        <br />
                        <span className="font-normal text-xs text-gray-600">(BL against BL List)</span>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        AI Match Score
                        <br />
                        <span className="font-normal text-xs text-gray-600">(BL against VIN List)</span>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blValidationData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.blNo}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                              <div className="h-full bg-green-500" style={{ width: `${item.blListMatch}%` }} />
                            </div>
                            <span className="text-sm text-gray-900 font-medium">{item.blListMatch}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                              <div className="h-full bg-green-500" style={{ width: `${item.vinListMatch}%` }} />
                            </div>
                            <span className="text-sm text-gray-900 font-medium">{item.vinListMatch}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Manifest Generation Section */}
          <AccordionItem value="manifest-generation" className="bg-white rounded-lg border border-gray-200">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-semibold text-gray-900">Cargo Manifest Generation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-900 font-medium">
                  Cargo Manifest - AI populates manifest fields based on validated cargo data. Review the information
                  before EDI submission to PortNet.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {manifestFields.map((field, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">{field.label}</p>
                    <p className="text-sm font-medium text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" disabled className="gap-2 bg-gray-100 text-gray-500 cursor-not-allowed">
                  <Mail className="w-4 h-4" />
                  Draft Email
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  Download Manifest File
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EDI Submission Section */}
          <AccordionItem value="edi-submission" className="bg-white rounded-lg border border-gray-200">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">EDI PortNet Submission</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-900 font-medium">
                  Submission Status - Manifest has been successfully submitted to PortNet via EDI and acknowledged.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Submitted At</p>
                  <p className="text-sm font-medium text-gray-900">{ediSubmissionData.submittedAt}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">PortNet Reference</p>
                  <p className="text-sm font-medium text-gray-900">{ediSubmissionData.portnetReference}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="text-sm font-medium text-green-700">{ediSubmissionData.status}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">EDI Message ID</p>
                  <p className="text-sm font-medium text-gray-900">{ediSubmissionData.ediMessageId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
                  <p className="text-xs text-gray-600 mb-1">Acknowledgment Time</p>
                  <p className="text-sm font-medium text-gray-900">{ediSubmissionData.acknowledgmentTime}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" asChild>
            <Link href={`/shipments/${shipment.id}/validation`}>Back to Pre-submission</Link>
          </Button>
          <Button asChild>
            <Link href={`/shipments/${shipment.id}/pre-arrival`}>Proceed to Pre-Arrival Validation</Link>
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        title="Upload Ad-hoc Document"
      />
    </div>
  )
}
