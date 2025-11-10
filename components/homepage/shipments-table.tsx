"use client"

import type { Shipment, OpsType } from "@/types"
import { Check, Circle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ShipmentsTableProps {
  shipments: Shipment[]
}

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Shipment Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Transaction Start Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Vessel Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ETA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ops Type</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Berth Confirmation
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Pre-Submission
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                PortNet Submission
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cargo Pre-Arrival Validation
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Discharge Summary
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Unberthing
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <Link href={`/shipments/${shipment.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {shipment.shipmentNumber}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{shipment.transactionStartTime}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{shipment.vesselName}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{shipment.eta}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {(shipment.opsTypes || []).map((opsType) => (
                      <OpsTypeBadge key={opsType} opsType={opsType} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.berthConfirmation} />
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.preSubmission} />
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.portnetSubmission} />
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.preArrivalValidation} />
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.dischargeSummary} />
                </td>
                <td className="px-4 py-4 text-center">
                  <StageIndicator completed={shipment.stages.vesselArrival} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StageIndicator({ completed }: { completed: boolean }) {
  return (
    <div className="flex justify-center">
      {completed ? (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <Circle className="w-3 h-3 text-gray-300" />
        </div>
      )}
    </div>
  )
}

function OpsTypeBadge({ opsType }: { opsType: OpsType }) {
  const variants: Record<OpsType, { variant: "secondary" | "default"; className: string }> = {
    Bunkering: { variant: "secondary", className: "bg-gray-200 text-gray-700 hover:bg-gray-200" },
    Discharge: { variant: "default", className: "bg-blue-500 text-white hover:bg-blue-500" },
    Loading: { variant: "default", className: "bg-blue-500 text-white hover:bg-blue-500" },
  }

  const config = variants[opsType]

  return (
    <Badge variant={config.variant} className={`${config.className} justify-center text-xs`}>
      {opsType}
    </Badge>
  )
}
