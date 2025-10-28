"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText, Package, Truck, Car } from "lucide-react"
import { StatusChip } from "@/components/status-chip"
import Link from "next/link"

export default function DischargeSummaryPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)
    if (found) setShipment(found)
  }, [params.id])

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const dischargeSummary = {
    dischargeNumber: "DS-2025-004-001",
    generatedAt: "2025-08-25 09:00:00",
    generatedBy: "Ryan (Admin)",
    vesselName: "Pacific Glory",
    eta: "2025-08-28 14:00:00",
    totalCargoItems: 50,
    totalUnits: 50,
    totalWeight: 75000,
    yardPlan: "Yard-A-Section-3",
  }

  const cargoBreakdown = [
    { type: "Cars", count: 30, weight: 45000, percentage: 60 },
    { type: "Trucks", count: 15, weight: 22500, percentage: 30 },
    { type: "Others", count: 5, weight: 7500, percentage: 10 },
  ]

  const dischargeList = [
    {
      blNumber: "HDGLCNS0634447",
      cargoType: "Car",
      units: 5,
      weight: 7500,
      destination: "Yard-A-Section-3",
      priority: "Normal",
    },
    {
      blNumber: "HDGLCNS0634567",
      cargoType: "Truck",
      units: 3,
      weight: 4500,
      destination: "Yard-A-Section-3",
      priority: "Normal",
    },
    {
      blNumber: "HDGLCNS0634571",
      cargoType: "Car",
      units: 5,
      weight: 7500,
      destination: "Yard-A-Section-3",
      priority: "Normal",
    },
    {
      blNumber: "HDGLKRAU0635562",
      cargoType: "Truck",
      units: 2,
      weight: 3000,
      destination: "Yard-A-Section-3",
      priority: "High",
    },
    {
      blNumber: "HDGLKRBN0635738",
      cargoType: "Car",
      units: 5,
      weight: 7500,
      destination: "Yard-A-Section-3",
      priority: "Normal",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Shipment
          </Link>
          <span>/</span>
          <Link href={`/shipments/${shipment.id}`} className="hover:text-gray-900">
            Shipment {shipment.shipmentNumber}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Discharge Summary</span>
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Discharge Summary</h1>
                <p className="text-sm text-gray-600">Consolidated discharge list for port operations</p>
              </div>
            </div>
            <StatusChip status="completed" label="Generated" />
          </div>
        </div>

        {/* Summary Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Discharge Number</p>
              <p className="font-medium text-gray-900">{dischargeSummary.dischargeNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Vessel Name</p>
              <p className="font-medium text-gray-900">{dischargeSummary.vesselName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Generated At</p>
              <p className="font-medium text-gray-900">{dischargeSummary.generatedAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Arrival</p>
              <p className="font-medium text-gray-900">{dischargeSummary.eta}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Generated By</p>
              <p className="font-medium text-gray-900">{dischargeSummary.generatedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Yard Plan</p>
              <p className="font-medium text-gray-900">{dischargeSummary.yardPlan}</p>
            </div>
          </div>
        </div>

        {/* Cargo Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cargo Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Items</p>
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dischargeSummary.totalCargoItems}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Units</p>
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dischargeSummary.totalUnits}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Weight</p>
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dischargeSummary.totalWeight.toLocaleString()} kg</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Yard Location</p>
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{dischargeSummary.yardPlan}</p>
            </div>
          </div>

          {/* Cargo Breakdown */}
          <div className="space-y-3">
            {cargoBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24">
                  <div className="flex items-center gap-2">
                    {item.type === "Cars" ? (
                      <Car className="w-4 h-4 text-blue-600" />
                    ) : item.type === "Trucks" ? (
                      <Truck className="w-4 h-4 text-green-600" />
                    ) : (
                      <Package className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      {item.count} units • {item.weight.toLocaleString()} kg
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.type === "Cars" ? "bg-blue-600" : item.type === "Trucks" ? "bg-green-600" : "bg-amber-600"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discharge List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Discharge List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">BL Number</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cargo Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Units</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Weight (kg)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Destination</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                </tr>
              </thead>
              <tbody>
                {dischargeList.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.blNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.cargoType}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.units}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.weight.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.destination}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.priority === "High" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing 5 of {dischargeSummary.totalCargoItems} items • Full list available in downloadable report
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download Discharge List
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download Yard Plan
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/shipments/${shipment.id}/pre-arrival`}>View Pre-Arrival Validation</Link>
            </Button>
            <Button asChild>
              <Link href={`/shipments/${shipment.id}/vessel-arrival`}>Proceed to Vessel Arrival</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
