"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, AuditEntry } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { auditTrail } from "@/lib/audit-trail"
import { generateAuditTrailCSV, downloadFile } from "@/lib/export-utils"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { AuditTrailTable } from "@/components/audit/audit-trail-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Toast } from "@/components/ui/toast"

export default function AuditTrailPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [chainValid, setChainValid] = useState(true)
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
      loadAuditEntries(found.id)
    }
  }, [params.id])

  const loadAuditEntries = (shipmentId: string) => {
    const allEntries = auditTrail.getEntries()
    const shipmentEntries = allEntries.filter((entry) => entry.details.includes(shipmentId))
    setEntries(shipmentEntries)

    // Verify chain integrity
    const isValid = auditTrail.verifyChain()
    setChainValid(isValid)
  }

  const handleExportAuditTrail = () => {
    if (entries.length === 0) {
      showToast("warning", "No Data", "No audit entries to export")
      return
    }

    const csv = generateAuditTrailCSV(entries)
    downloadFile(csv, `audit-trail-${shipment?.shipmentNumber || "export"}.csv`, "text/csv")

    showToast("success", "Export Complete", "Audit trail exported successfully")

    // Add audit entry for the export action
    auditTrail.addEntry("Ryan", "Audit Trail Export", `Exported audit trail for shipment ${shipment?.id}`)
    loadAuditEntries(shipment?.id || "")
  }

  const handleRefresh = () => {
    if (shipment) {
      loadAuditEntries(shipment.id)
      showToast("info", "Refreshed", "Audit trail data refreshed")
    }
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
          <span className="text-gray-900 font-medium">Audit Trail</span>
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
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
                <p className="text-sm text-gray-600">Complete history of all actions for this shipment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button onClick={handleExportAuditTrail} size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Chain Verification Status */}
        <div
          className={`rounded-lg border p-4 mb-6 ${
            chainValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {chainValid ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Audit Chain Verified</p>
                  <p className="text-sm text-green-800">
                    All {entries.length} entries have been cryptographically verified and the chain is intact.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Chain Verification Failed</p>
                  <p className="text-sm text-red-800">
                    The audit trail has been tampered with or corrupted. Please contact system administrator.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Entries</p>
            <p className="text-3xl font-bold text-gray-900">{entries.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Unique Users</p>
            <p className="text-3xl font-bold text-gray-900">{new Set(entries.map((e) => e.user)).size}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Chain Status</p>
            <p className="text-3xl font-bold text-gray-900">{chainValid ? "Valid" : "Invalid"}</p>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Entries</h2>
          {entries.length > 0 ? (
            <AuditTrailTable entries={entries} showVerification={true} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Audit Entries</p>
              <p className="text-sm">No actions have been recorded for this shipment yet.</p>
            </div>
          )}
        </div>

        {/* Technical Details */}
        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Hash Algorithm:</span> Demo-grade simple hash (production would use SHA-256)
            </p>
            <p>
              <span className="font-medium">Chain Structure:</span> Each entry contains hash of previous entry
            </p>
            <p>
              <span className="font-medium">Storage:</span> Browser LocalStorage (production would use secure database)
            </p>
            <p>
              <span className="font-medium">Verification:</span> Automatic chain integrity check on load
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
