"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ship, MapPin, Anchor } from "lucide-react"
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

  const timelineEvents = [
    {
      icon: Ship,
      title: "Vessel Arrival",
      time: "08:00 AM",
    },
    {
      icon: MapPin,
      title: "Vessel Location",
      time: "10:00 AM",
    },
    {
      icon: Anchor,
      title: "Vessel Departure",
      time: "02:00 PM",
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
          <span className="text-gray-900 font-medium">Unberthing</span>
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

        <ShipmentDetailsCard shipment={shipment} />

        {/* Unberthing Operation Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h1 className="text-xl font-bold text-gray-900 mb-8 text-center">Unberthing Operation Timeline</h1>

          <div className="max-w-xl mx-auto space-y-10">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h2>
                  <p className="text-base text-blue-600">{event.time}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
