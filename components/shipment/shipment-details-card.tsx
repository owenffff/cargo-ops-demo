import type { Shipment } from "@/types"
import { Ship, Calendar, User, MapPin } from "lucide-react"

interface ShipmentDetailsCardProps {
  shipment: Shipment
}

export function ShipmentDetailsCard({ shipment }: ShipmentDetailsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Ship className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment {shipment.shipmentNumber}</h1>
          <p className="text-sm text-gray-600 mt-1">Details for shipment #{shipment.shipmentNumber}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Shipment Created On:</span> {shipment.createdOn}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Ship className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 mb-1">Vessel Name:</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.vesselName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 mb-1">ETA:</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.eta}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 mb-1">Ship Principal:</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.shipPrincipal}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 mb-1">Change of Destination:</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.changeOfDestination || "NIL"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
