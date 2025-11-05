import type { Shipment } from "@/types"
import { Ship, Clock, User, MapPin } from "lucide-react"

interface ShipmentDetailsCardProps {
  shipment: Shipment
}

export function ShipmentDetailsCard({ shipment }: ShipmentDetailsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Shipment Created On: {shipment.createdOn}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Ship className="w-6 h-6 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Vessel Name:</p>
            <p className="text-sm text-gray-700">{shipment.vesselName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Estimated ETA:</p>
            <p className="text-sm text-gray-700">{shipment.eta}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Actual ETA:</p>
            <p className="text-sm text-gray-700">NIL</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-6 h-6 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Ship Principal:</p>
            <p className="text-sm text-gray-700">{shipment.shipPrincipal}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-gray-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Change of Destination:</p>
            <p className="text-sm text-gray-700">{shipment.changeOfDestination || "NIL"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
