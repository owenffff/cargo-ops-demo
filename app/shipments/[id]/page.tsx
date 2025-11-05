"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function ShipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)

    if (found) {
      // Migrate shipment to add berthConfirmation if missing
      if (found.stages && !('berthConfirmation' in found.stages)) {
        const migratedShipment = {
          ...found,
          stages: {
            berthConfirmation: true,
            ...found.stages
          }
        }

        // Update in localStorage
        const updatedShipments = shipments.map(s =>
          s.id === found.id ? migratedShipment : s
        )
        LocalStorage.setShipments(updatedShipments)

        setShipment(migratedShipment)
      } else {
        setShipment(found)
      }
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h2>
          <p className="text-gray-600 mb-4">The shipment you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/")}>Return to Homepage</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Shipment
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shipment {shipment.shipmentNumber}</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStatus={shipment.status} stages={shipment.stages} shipmentId={shipment.id} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shipments
          </Button>
        </div>

        <ShipmentDetailsCard shipment={shipment} />

        {/* Action Buttons based on current stage */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Phase Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/berth-confirmation`}>
                <FileText className="w-4 h-4 mr-2" />
                Berth Confirmation
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/validation`}>
                <FileText className="w-4 h-4 mr-2" />
                Pre-submission
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/portnet-submission`}>
                <FileText className="w-4 h-4 mr-2" />
                PortNet Submission
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/pre-arrival`}>
                <FileText className="w-4 h-4 mr-2" />
                Pre-Arrival
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/discharge`}>
                <FileText className="w-4 h-4 mr-2" />
                Discharge Summary
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href={`/shipments/${shipment.id}/vessel-arrival`}>
                <FileText className="w-4 h-4 mr-2" />
                Vessel Arrival
              </Link>
            </Button>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/shipments/${shipment.id}/audit`}>View Audit Trail</Link>
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shipments
            </Button>
          </div>
        </div>

        {/* Stage-specific content */}
        <div className="mt-8">
          <StageContent shipment={shipment} />
        </div>
      </div>
    </div>
  )
}

function StageContent({ shipment }: { shipment: Shipment }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Stage Information</h2>

      {shipment.status === "berth-confirmation" && (
        <div>
          <p className="text-gray-700 mb-4">
            This shipment is in the berth confirmation stage. You need to confirm the berth allocation and vessel
            details before proceeding to pre-submission.
          </p>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h3 className="font-semibold text-cyan-900 mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside text-sm text-cyan-800 space-y-1">
              <li>Confirm berth allocation</li>
              <li>Verify vessel arrival time</li>
              <li>Validate terminal assignment</li>
              <li>Approve berth booking</li>
            </ul>
          </div>
        </div>
      )}

      {shipment.status === "pre-submission" && (
        <div>
          <p className="text-gray-700 mb-4">
            This shipment is in the pre-submission stage. You need to upload and validate the Bill of Ladings and Cargo
            Allocation Plan before proceeding to PortNet submission.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Upload Bill of Lading documents</li>
              <li>Upload Cargo Allocation Plan</li>
              <li>Validate document confidence scores</li>
              <li>Ensure unit counts match between documents</li>
            </ul>
          </div>
        </div>
      )}

      {shipment.status === "portnet-submission" && (
        <div>
          <p className="text-gray-700 mb-4">
            Documents have been submitted to PortNet. Waiting for acknowledgment and preparing for pre-arrival
            validation.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">In Progress:</h3>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              <li>PortNet processing submission</li>
              <li>Awaiting manifest acknowledgment</li>
              <li>Preparing validation checks</li>
            </ul>
          </div>
        </div>
      )}

      {shipment.status === "pre-arrival-validation" && (
        <div>
          <p className="text-gray-700 mb-4">
            Pre-arrival validation is in progress. Review the validation results and prepare the discharge summary.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Validation Status:</h3>
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Document validation completed</li>
              <li>Unit counts verified</li>
              <li>Ready for discharge summary generation</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
