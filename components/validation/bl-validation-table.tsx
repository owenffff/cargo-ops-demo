"use client"

import type { BillOfLading } from "@/types"
import { ConfidenceBar } from "@/components/confidence-bar"

interface BLValidationTableProps {
  bills: BillOfLading[]
  onEdit?: (bl: BillOfLading) => void
  onView?: (bl: BillOfLading) => void
}

export function BLValidationTable({ bills, onEdit, onView }: BLValidationTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">BL No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                AI Match Score (BL against BL List)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                AI Match Score (BL against VIN List)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bills.map((bl) => (
              <tr key={bl.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{bl.blNumber}</td>
                <td className="px-4 py-4">
                  <div className="max-w-xs">
                    <ConfidenceBar score={bl.matchScoreBL || 0} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-xs">
                    <ConfidenceBar score={bl.matchScoreVIN || 0} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(bl)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit/View
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
