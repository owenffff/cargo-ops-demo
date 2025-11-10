"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, Document } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { mockExtractDocument } from "@/lib/mock-extract"
import { auditTrail } from "@/lib/audit-trail"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { DocumentsTable } from "@/components/validation/documents-table"
import { ConfidenceBar } from "@/components/confidence-bar"
import { UploadModal } from "@/components/upload/upload-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Upload, ScrollText, Search } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function PortNetSubmissionPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"BL" | "BL_LIST" | "VIN_LIST" | "MANIFEST" | "PORTNET">("BL_LIST")

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)
    if (found) {
      setShipment(found)
      // Load documents for this shipment
      const docs = LocalStorage.getDocuments(found.id)
      setDocuments(docs)
    }
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
    setDocuments(updatedDocs)

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Document Upload",
      `Uploaded ${files.length} ${uploadType} document(s) for shipment ${shipment.id} in PortNet Submission stage`,
    )

    toast.success(`${files.length} document(s) uploaded successfully`)
    setUploadModalOpen(false)
  }

  const handleDeleteDocument = (doc: Document) => {
    if (!shipment) return
    const updatedDocs = documents.filter((d) => d.id !== doc.id)
    LocalStorage.setDocuments(shipment.id, updatedDocs)
    setDocuments(updatedDocs)

    auditTrail.addEntry("Ryan", "Document Deleted", `Deleted document ${doc.documentName}`)
    toast.success("Document deleted successfully")
  }

  const handleViewDocument = (doc: Document) => {
    toast.info(`Viewing ${doc.documentName}`)
  }

  const handleEditDocument = (doc: Document) => {
    toast.info(`Editing ${doc.documentName}`)
  }

  const handleDownloadDocument = (doc: Document) => {
    toast.success(`Downloaded ${doc.documentName}`)
  }

  const handleGenerateManifest = () => {
    toast.success("Manifest generated successfully")
    auditTrail.addEntry("Ryan", "Manifest Generated", `Generated cargo manifest for shipment ${shipment?.id}`)
  }

  const handleViewAuditTrail = () => {
    if (shipment) {
      router.push(`/shipments/${shipment.id}/audit`)
    }
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Mock data for BL validation
  const blValidationData = [
    {
      id: "1",
      blNumber: "HDGLCNSG0634447",
      matchScoreBL: 100,
      matchScoreVIN: 100,
    },
    {
      id: "2",
      blNumber: "HDGLCNSG0634567",
      matchScoreBL: 100,
      matchScoreVIN: 100,
    },
    {
      id: "3",
      blNumber: "HDGLCNSG0634571",
      matchScoreBL: 100,
      matchScoreVIN: 100,
    },
    {
      id: "4",
      blNumber: "HDGLKRAU0635562",
      matchScoreBL: 100,
      matchScoreVIN: 100,
    },
    {
      id: "5",
      blNumber: "HDGLKRBN0635738",
      matchScoreBL: 100,
      matchScoreVIN: 100,
    },
  ]

  // Mock data for cargo details summary
  const cargoSummary = {
    numberOfCargoUnits: 50,
    numberOfCar: 20,
    numberOfTrucks: 20,
    numberOfOthers: 20,
    totalWeight: "700 kg",
  }

  // Mock data for cargo classification
  const cargoClassificationData = [
    {
      blNo: "HDGLCNSG0634447",
      cargoType: { value: "Passenger Car", confidence: 100 },
      originDestination: { value: "LKHBA → MACAS", confidence: 100 },
      cargoStatus: { value: "Transshipment", confidence: 100 },
    },
    {
      blNo: "HDGLCNSG0634567",
      cargoType: { value: "Passenger Car", confidence: 100 },
      originDestination: { value: "CNYNT → LKHBA", confidence: 100 },
      cargoStatus: { value: "Local", confidence: 100 },
    },
    {
      blNo: "HDGLCNSG0634571",
      cargoType: { value: "Truck", confidence: 100 },
      originDestination: { value: "IDJKT → MXLZC", confidence: 100 },
      cargoStatus: { value: "Transshipment", confidence: 100 },
    },
    {
      blNo: "HDGLKRAU0635562",
      cargoType: { value: "Tractor", confidence: 100 },
      originDestination: { value: "KRUSN → QAHMD", confidence: 100 },
      cargoStatus: { value: "Local", confidence: 100 },
    },
    {
      blNo: "HDGLKRBN0635738",
      cargoType: { value: "Bus", confidence: 100 },
      originDestination: { value: "DEBRV → AUMEL", confidence: 100 },
      cargoStatus: { value: "Transshipment", confidence: 100 },
    },
  ]

  // Calculate document stats
  const highConfidenceDocs = documents.filter((d) => d.aiConfidenceScore >= 95).length
  const lowConfidenceDocs = documents.filter((d) => d.aiConfidenceScore < 85).length

  return (
    <div className="min-h-screen bg-gray-50">
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
        </div>

        <ShipmentDetailsCard shipment={shipment} />

        {/* SECTION 1: Documents */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI confidence score &gt; 85%</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {highConfidenceDocs}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI confidence score &lt; 85%</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {lowConfidenceDocs}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <Button variant="outline" size="sm">
                Filters
              </Button>
            </div>
          </div>

          {/* Documents Table */}
          <DocumentsTable
            documents={documents}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => {
                  setUploadType("BL_LIST")
                  setUploadModalOpen(true)
                }}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload BL List + VIN List + LOA
              </Button>
              <Button variant="outline">Request Readmission</Button>
            </div>
            <Button variant="ghost" onClick={handleViewAuditTrail} className="gap-2 text-blue-600">
              View Audit Trail
              <ScrollText className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* SECTION 2: Validate BL against BL List and VIN List */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Validate BL against BL list and VIN list</h2>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" size="sm">
              Filters
            </Button>
          </div>

          {/* BL Validation Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">BL No.</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    AI Match Score
                    <br />
                    <span className="font-normal text-xs text-gray-600">(BL against BL List)</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    AI Match Score
                    <br />
                    <span className="font-normal text-xs text-gray-600">(BL against VIN List)</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blValidationData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{item.blNumber}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <ConfidenceBar score={item.matchScoreBL} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <ConfidenceBar score={item.matchScoreVIN} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View/Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">Download</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={handleViewAuditTrail} className="gap-2 text-blue-600">
              View Audit Trail
              <ScrollText className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* SECTION 3: Cargo Details */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Cargo Details</h2>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" size="sm">
              Filters
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Number of Cargo Units</p>
              <p className="text-3xl font-bold text-gray-900">{cargoSummary.numberOfCargoUnits}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Number of Car</p>
              <p className="text-3xl font-bold text-gray-900">{cargoSummary.numberOfCar}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Number of Trucks</p>
              <p className="text-3xl font-bold text-gray-900">{cargoSummary.numberOfTrucks}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Number of Others</p>
              <p className="text-3xl font-bold text-gray-900">{cargoSummary.numberOfOthers}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Total Weight</p>
              <p className="text-3xl font-bold text-gray-900">{cargoSummary.totalWeight}</p>
            </div>
          </div>

          {/* Cargo Classification Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">BL No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cargo Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Origin → Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cargo Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cargoClassificationData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{item.blNo}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-blue-600 font-medium">{item.cargoType.value}</p>
                        <ConfidenceBar score={item.cargoType.confidence} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-green-600 font-medium">{item.originDestination.value}</p>
                        <ConfidenceBar score={item.originDestination.confidence} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-green-600 font-medium">{item.cargoStatus.value}</p>
                        <ConfidenceBar score={item.cargoStatus.confidence} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View/Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">Download</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cargo Manifest */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Manifest</h3>
            <div className="flex items-center justify-between">
              <Button onClick={handleGenerateManifest} className="gap-2">
                <FileText className="w-4 h-4" />
                Generate Manifest
              </Button>
              <Button variant="ghost" onClick={handleViewAuditTrail} className="gap-2 text-blue-600">
                View Audit Trail
                <ScrollText className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center mt-8">
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
        title="Upload Document"
      />
    </div>
  )
}
