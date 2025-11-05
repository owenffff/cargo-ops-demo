"use client"

import { useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import { ConfidenceBar } from "@/components/confidence-bar"

interface EnhancedShipmentsTableProps {
  shipments: Shipment[]
}

export function EnhancedShipmentsTable({ shipments }: EnhancedShipmentsTableProps) {
  const router = useRouter()

  const getStageProgress = (shipment: Shipment) => {
    if (shipment.status === "completed") {
      return 100
    }

    const stages = [
      shipment.stages.berthConfirmation,
      shipment.stages.preSubmission,
      shipment.stages.portnetSubmission,
      shipment.stages.preArrivalValidation,
      shipment.stages.dischargeSummary,
      shipment.stages.vesselArrival,
    ]
    const completed = stages.filter(Boolean).length
    return Math.round((completed / stages.length) * 100)
  }

  if (shipments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No shipments found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Shipment Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Vessel Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Ship Principal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ETA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((shipment) => {
              const progress = getStageProgress(shipment)
              return (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/shipments/${shipment.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {shipment.shipmentNumber}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.vesselName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.shipPrincipal}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.eta}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip status={shipment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[120px]">
                        <ConfidenceBar score={progress} showLabel={false} />
                      </div>
                      <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/shipments/${shipment.id}`)}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/shipments/${shipment.id}/audit`)}
                        className="gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Audit
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
