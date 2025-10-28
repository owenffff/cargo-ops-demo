"use client"

import type { Alert } from "@/types"
import { AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  alert: Alert
  onDismiss?: (id: string) => void
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const bgColors = {
    error: "bg-red-50 border-red-200",
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
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border", bgColors[alert.type])}>
      <AlertCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[alert.type])} />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900">{alert.title}</h4>
        <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
        {alert.shipmentNumber && <p className="text-xs text-gray-600 mt-2">ETA: {alert.timestamp}</p>}
        {alert.shipmentNumber && <p className="text-xs text-gray-600">Shipment Number: {alert.shipmentNumber}</p>}
      </div>

      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
