"use client"

import { useState, useEffect } from "react"
import { Package, Ship, Boxes, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import { LocalStorage } from "@/lib/storage"
import { mockShipments } from "@/lib/mock-data"
import type { Shipment } from "@/types"

export default function GroundPlanPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])

  useEffect(() => {
    // Load shipments
    const storedShipments = LocalStorage.getShipments()
    const shipmentsToUse = storedShipments.length > 0 ? storedShipments : mockShipments
    setShipments(shipmentsToUse)
  }, [])

  // Calculate statistics
  const activeShipments = shipments.filter((s) => s.status !== "Completed").length
  const arrivedShipments = shipments.filter((s) => s.status === "Vessel Arrived").length
  const inTransitShipments = shipments.filter((s) => s.status === "In Transit").length
  const pendingShipments = shipments.filter(
    (s) => s.status === "Pre-Submission" || s.status === "Document Validation",
  ).length

  return (
    <div className="min-h-screen bg-gray-50 pl-20 pt-16">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ground Plan</h1>
          <p className="text-gray-600">Visual overview of cargo ground planning and allocation</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Ship className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{activeShipments}</span>
            </div>
            <p className="text-sm text-gray-600">Active Shipments</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{arrivedShipments}</span>
            </div>
            <p className="text-sm text-gray-600">Arrived Vessels</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">{inTransitShipments}</span>
            </div>
            <p className="text-sm text-gray-600">In Transit</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-amber-600" />
              <span className="text-3xl font-bold text-gray-900">{pendingShipments}</span>
            </div>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
        </div>

        {/* Ground Plan Visualization */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Ground Allocation Map</h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Boxes className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ground Plan Visualization</h3>
              <p className="text-gray-600 max-w-md">
                Visual representation of cargo ground allocation will be displayed here. This feature shows the
                physical layout of cargo storage areas and their current allocation status.
              </p>
            </div>
          </div>
        </div>

        {/* Shipment List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Shipments Overview</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vessel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ground Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{shipment.shipmentNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.vesselName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          shipment.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : shipment.status === "Vessel Arrived"
                              ? "bg-blue-100 text-blue-800"
                              : shipment.status === "In Transit"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.eta}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.totalUnits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {shipment.status === "Vessel Arrived" || shipment.status === "Completed"
                          ? "Allocated"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {shipments.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-600">Shipments will appear here once they are created</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
