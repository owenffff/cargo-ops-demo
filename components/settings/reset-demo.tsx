"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LocalStorage } from "@/lib/storage"
import { auditTrail } from "@/lib/audit-trail"
import { AlertTriangle, RefreshCw } from "lucide-react"

export function ResetDemo() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = () => {
    // Clear all storage
    LocalStorage.resetAll()
    auditTrail.reset()

    // Reload page
    window.location.href = "/"
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Demo Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            This will clear all demo data including shipments, documents, audit trail, and settings. This action cannot
            be undone.
          </p>

          {!showConfirm ? (
            <Button variant="outline" onClick={() => setShowConfirm(true)} className="text-red-600 border-red-600">
              Reset All Data
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-red-700">Are you sure?</p>
              <Button onClick={handleReset} size="sm" className="bg-red-600 hover:bg-red-700 gap-2">
                <RefreshCw className="w-4 h-4" />
                Yes, Reset Everything
              </Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)} size="sm">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
