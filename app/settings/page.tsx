"use client"

import { SettingsIcon, Database, Shield, Download } from "lucide-react"
import { ResetDemo } from "@/components/settings/reset-demo"
import { Button } from "@/components/ui/button"
import { auditTrail } from "@/lib/audit-trail"
import { generateAuditTrailCSV, downloadFile } from "@/lib/export-utils"
import { LocalStorage } from "@/lib/storage"
import { useState } from "react"
import { Toast } from "@/components/ui/toast"

export default function SettingsPage() {
  const [toast, setToast] = useState<{ show: boolean; variant: any; title: string; description: string }>({
    show: false,
    variant: "info",
    title: "",
    description: "",
  })

  const handleExportAllData = () => {
    const shipments = LocalStorage.getShipments()
    const alerts = LocalStorage.getAlerts()
    const entries = auditTrail.getEntries()

    const data = {
      shipments,
      alerts,
      auditTrail: entries,
      exportedAt: new Date().toISOString(),
    }

    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `cargo-ops-export-${Date.now()}.json`, "application/json")

    showToast("success", "Export Complete", "All data exported successfully")
  }

  const handleExportAuditTrail = () => {
    const entries = auditTrail.getEntries()
    const csv = generateAuditTrailCSV(entries)
    downloadFile(csv, `audit-trail-complete-${Date.now()}.csv`, "text/csv")

    showToast("success", "Export Complete", "Audit trail exported successfully")
  }

  const showToast = (variant: any, title: string, description: string) => {
    setToast({ show: true, variant, title, description })
    setTimeout(() => setToast({ show: false, variant: "info", title: "", description: "" }), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 right-6 z-50">
          <Toast variant={toast.variant} title={toast.title} description={toast.description} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your demo data and export options</p>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download your demo data for backup or analysis. Includes shipments, alerts, and audit trail.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleExportAllData} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export All Data (JSON)
                </Button>
                <Button variant="outline" onClick={handleExportAuditTrail} className="gap-2 bg-transparent">
                  <Shield className="w-4 h-4" />
                  Export Audit Trail (CSV)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Storage Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                This demo uses browser LocalStorage for data persistence. Data is stored locally on your device.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Shipments</span>
                  <span className="font-medium text-gray-900">{LocalStorage.getShipments().length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Active Alerts</span>
                  <span className="font-medium text-gray-900">
                    {LocalStorage.getAlerts().filter((a) => !a.dismissed).length}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Audit Entries</span>
                  <span className="font-medium text-gray-900">{auditTrail.getEntries().length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Demo */}
        <ResetDemo />

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Information</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• This is a frontend-only demo with mock data and simulated AI processing</li>
            <li>• No real API calls or server-side processing occurs</li>
            <li>• All data is stored locally in your browser</li>
            <li>• Confidence scores and validations use deterministic mock logic</li>
            <li>• Audit trail uses demo-grade hashing (production would use SHA-256)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
