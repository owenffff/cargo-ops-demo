"use client"

import type { CargoItem } from "@/types"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Edit, Eye } from "lucide-react"

interface CargoClassificationTableProps {
  items: CargoItem[]
  onEdit?: (item: CargoItem) => void
  onView?: (item: CargoItem) => void
}

export function CargoClassificationTable({ items, onEdit, onView }: CargoClassificationTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">BL No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cargo Type (AI)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                AI Confidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Origin → Destination
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Cargo Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Units</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Weight (kg)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.blNumber}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.cargoType}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[120px]">
                    <ConfidenceBar score={item.aiConfidence} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {item.origin} → {item.destination}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.cargoStatus === "Local" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.cargoStatus}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 text-center">{item.units}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.weight.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
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
