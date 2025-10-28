"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ship, CheckCircle, Clock, Package } from "lucide-react"
import { StatusChip } from "@/components/status-chip"
import Link from "next/link"

export default function VesselArrivalPage() {
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

  const arrivalData = {
    vesselName: "Pacific Glory",
    actualArrival: "2025-08-28 14:15:00",
    berthingTime: "2025-08-28 15:00:00",
    dischargeStarted: "2025-08-28 16:00:00",
    dischargeCompleted: "2025-08-29 18:00:00",
    totalCargoItems: 50,
    dischargedItems: 50,
    progressPercentage: 100,
  }

  const dischargeProgress = [
    {
      timestamp: "2025-08-28 16:00:00",
      activity: "Discharge Started",
      items: 0,
      status: "completed",
    },
    {
      timestamp: "2025-08-28 18:30:00",
      activity: "First Batch Completed",
      items: 15,
      status: "completed",
    },
    {
      timestamp: "2025-08-29 09:00:00",
      activity: "Second Batch Completed",
      items: 30,
      status: "completed",
    },
    {
      timestamp: "2025-08-29 14:00:00",
      activity: "Third Batch Completed",
      items: 45,
      status: "completed",
    },
    {
      timestamp: "2025-08-29 18:00:00",
      activity: "Discharge Completed",
      items: 50,
      status: "completed",
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
          <span className="text-gray-900 font-medium">Vessel Arrival</span>
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vessel Arrival & Discharge</h1>
                <p className="text-sm text-gray-600">Real-time cargo discharge operations</p>
              </div>
            </div>
            <StatusChip status="completed" label="Completed" />
          </div>
        </div>

        {/* Arrival Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Arrival Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vessel Name</p>
              <p className="font-medium text-gray-900">{arrivalData.vesselName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Actual Arrival</p>
              <p className="font-medium text-gray-900">{arrivalData.actualArrival}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Berthing Time</p>
              <p className="font-medium text-gray-900">{arrivalData.berthingTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Discharge Started</p>
              <p className="font-medium text-gray-900">{arrivalData.dischargeStarted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Discharge Completed</p>
              <p className="font-medium text-gray-900">{arrivalData.dischargeCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Duration</p>
              <p className="font-medium text-gray-900">26 hours</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Discharge Progress</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{arrivalData.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${arrivalData.progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">
                {arrivalData.dischargedItems} of {arrivalData.totalCargoItems} items discharged
              </span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Items</p>
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{arrivalData.totalCargoItems}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Discharged</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{arrivalData.dischargedItems}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Remaining</p>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {arrivalData.totalCargoItems - arrivalData.dischargedItems}
              </p>
            </div>
          </div>
        </div>

        {/* Discharge Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Discharge Timeline</h2>
          <div className="space-y-4">
            {dischargeProgress.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {item.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{item.activity}</p>
                    <span className="text-sm text-gray-500">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.items} items processed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href={`/shipments/${shipment.id}/discharge`}>View Discharge Summary</Link>
          </Button>
          <Button asChild>
            <Link href={`/shipments/${shipment.id}/audit`}>View Complete Audit Trail</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
