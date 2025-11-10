"use client"

import type { Alert, Shipment } from "@/types"
import { AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LocalStorage } from "@/lib/storage"
import { useEffect, useState } from "react"

interface AlertCardProps {
  alert: Alert
  onDismiss?: (id: string) => void
}

// Map shipment status to human-readable stage labels
const statusToStageLabel: Record<string, string> = {
  "pre-submission": "Pre-Submission",
  "portnet-submission": "PortNet Submission",
  "pre-arrival-validation": "Cargo Pre-Arrival Validation",
  "discharge-summary": "Discharge Summary",
  "vessel-arrival": "Unberthing",
  completed: "Completed",
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const [shipment, setShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    if (alert.shipmentNumber) {
      const shipments = LocalStorage.getShipments()
      const found = shipments.find((s) => s.shipmentNumber === alert.shipmentNumber)
      if (found) setShipment(found)
    }
  }, [alert.shipmentNumber])

  const bgColors = {
    error: "bg-red-50/50 border-red-200/60",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
  }

  const iconColors = {
    error: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
    success: "text-green-600",
  }

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg border", bgColors[alert.type])}>
      <AlertCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[alert.type])} />

      <div className="flex-1 min-w-0 space-y-2">
        <h4 className="font-semibold text-sm text-gray-900">{alert.title}</h4>
        <p className="text-sm text-gray-700">{alert.description}</p>

        {alert.shipmentNumber && (
          <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
            <span>ETA: {alert.timestamp}</span>
            <span className="text-gray-400">|</span>
            <span>Shipment Number: {alert.shipmentNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 flex-shrink-0">
        {shipment && (
          <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 font-normal">
            {statusToStageLabel[shipment.status] || shipment.status}
          </Badge>
        )}

        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
