"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Anchor, MapPin, LifeBuoy } from "lucide-react"
import Link from "next/link"

export default function BerthConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)
    if (found) setShipment(found)
  }, [params.id])

  if (!shipment) {
    return <div className="p-8">Loading...</div>
  }

  // Mock berth confirmation data
  const berthData = {
    vesselName: "Jiuyang Bonanza",
    berthNo: "T04",
    berthingTime: "Oct 1, 2025, 08:00 AM",
    unBerthingTime: "Oct 1, 2025, 11:00 AM",
    status: "Completed",
  }

  const timeline = [
    {
      title: "Pilotage Service Request",
      time: "08:00 AM",
      icon: LifeBuoy,
    },
    {
      title: "Document Submission",
      time: "10:00 AM",
      icon: MapPin,
    },
    {
      title: "Berthing",
      time: "02:00 PM",
      icon: Anchor,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressStepper currentStatus={shipment.status} stages={shipment.stages} shipmentId={shipment.id} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push(`/shipments/${shipment.id}`)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shipment
          </Button>
        </div>

        <ShipmentDetailsCard shipment={shipment} />

        {/* Berth Confirmation Dashboard */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Berth Confirmation Dashboard</h1>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vessel Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Berth No.</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Berthing Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Un-berthing Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                      {berthData.vesselName}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{berthData.berthNo}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{berthData.berthingTime}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{berthData.unBerthingTime}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {berthData.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Berthing Operation Timeline */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Berthing Operation Timeline</h2>

          <div className="space-y-6">
            {timeline.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-blue-600">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
