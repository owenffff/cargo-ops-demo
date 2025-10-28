"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, Download } from "lucide-react"
import { StatusChip } from "@/components/status-chip"
import { ConfidenceBar } from "@/components/confidence-bar"
import Link from "next/link"

export default function PreArrivalValidationPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)
    if (found) setShipment(found)
  }, [params.id])

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const validationChecks = [
    {
      id: 1,
      check: "Manifest vs VIN List",
      status: "passed",
      confidence: 100,
      details: "All 50 VINs match manifest entries",
      timestamp: "2025-08-20 10:15:00",
    },
    {
      id: 2,
      check: "Manifest vs PortNet Summary",
      status: "passed",
      confidence: 98,
      details: "Cargo details verified against PortNet records",
      timestamp: "2025-08-20 10:16:30",
    },
    {
      id: 3,
      check: "BL vs VIN List",
      status: "passed",
      confidence: 100,
      details: "All Bill of Lading entries match VIN list",
      timestamp: "2025-08-20 10:17:45",
    },
    {
      id: 4,
      check: "Change of Destination Check",
      status: "passed",
      confidence: 100,
      details: "No COD requests detected",
      timestamp: "2025-08-20 10:18:00",
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "info",
      title: "Pre-Arrival Validation Complete",
      message: "All validation checks passed successfully. Ready for discharge summary generation.",
      timestamp: "2025-08-20 10:18:30",
      resolved: true,
    },
  ]

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
          <span className="text-gray-900 font-medium">Pre-Arrival Validation</span>
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

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cargo Pre-Arrival Validation</h1>
                <p className="text-sm text-gray-600">AI cross-checks before vessel arrival</p>
              </div>
            </div>
            <StatusChip status="completed" label="Validated" />
          </div>
        </div>

        {/* Alerts Dashboard */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Issues</h2>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border mb-3 last:mb-0 ${
                alert.type === "error"
                  ? "bg-red-50 border-red-200"
                  : alert.type === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.type === "error" ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{alert.title}</p>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  {alert.resolved && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Checks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validation Checks</h2>
          <div className="space-y-4">
            {validationChecks.map((check) => (
              <div key={check.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {check.status === "passed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{check.check}</p>
                      <p className="text-sm text-gray-600">{check.details}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{check.timestamp}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-600">AI Confidence Score</p>
                    <p className="text-sm font-medium text-gray-900">{check.confidence}%</p>
                  </div>
                  <ConfidenceBar score={check.confidence} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Validation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Checks</p>
              <p className="text-2xl font-bold text-gray-900">{validationChecks.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Passed</p>
              <p className="text-2xl font-bold text-green-700">
                {validationChecks.filter((c) => c.status === "passed").length}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Warnings</p>
              <p className="text-2xl font-bold text-amber-700">0</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Errors</p>
              <p className="text-2xl font-bold text-red-700">0</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download Validation Report
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/shipments/${shipment.id}/portnet-submission`}>View PortNet Submission</Link>
            </Button>
            <Button asChild>
              <Link href={`/shipments/${shipment.id}/discharge`}>Generate Discharge Summary</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
