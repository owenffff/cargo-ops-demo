"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, CargoItem } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { mockBillsOfLading } from "@/lib/mock-data"
import { generateMockCargoItems } from "@/lib/mock-cargo"
import { auditTrail } from "@/lib/audit-trail"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { CargoClassificationTable } from "@/components/cargo/cargo-classification-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Truck, Car, Box } from "lucide-react"
import { Toast } from "@/components/ui/toast"

export default function ClassificationPage() {
  const params = useParams()
  const router = useRouter()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([])
  const [toast, setToast] = useState<{ show: boolean; variant: any; title: string; description: string }>({
    show: false,
    variant: "info",
    title: "",
    description: "",
  })

  useEffect(() => {
    const shipments = LocalStorage.getShipments()
    const found = shipments.find((s) => s.id === params.id)

    if (found) {
      setShipment(found)

      // Generate cargo items from BLs
      const bills = mockBillsOfLading[found.id] || []
      const blNumbers = bills.map((b) => b.blNumber)
      const items = generateMockCargoItems(found.id, blNumbers)
      setCargoItems(items)
    }
  }, [params.id])

  const handleProceedToManifest = () => {
    if (!shipment) return

    // Add audit entry
    auditTrail.addEntry(
      "Ryan",
      "Cargo Classification Complete",
      `Classified ${cargoItems.length} cargo items for shipment ${shipment.id}`,
    )

    showToast("success", "Classification Complete", "Proceeding to manifest generation")

    setTimeout(() => {
      router.push(`/shipments/${shipment.id}/manifest`)
    }, 1500)
  }

  const showToast = (variant: any, title: string, description: string) => {
    setToast({ show: true, variant, title, description })
    setTimeout(() => setToast({ show: false, variant: "info", title: "", description: "" }), 3000)
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const carStats = {
    cars: cargoItems.filter((i) => i.cargoType === "Car").length,
    trucks: cargoItems.filter((i) => i.cargoType === "Truck").length,
    others: cargoItems.filter((i) => i.cargoType === "Other").length,
    totalUnits: cargoItems.reduce((sum, i) => sum + i.units, 0),
    totalWeight: cargoItems.reduce((sum, i) => sum + i.weight, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 right-6 z-50">
          <Toast variant={toast.variant} title={toast.title} description={toast.description} />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => router.push("/")} className="hover:text-gray-900">
            Shipment
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/shipments/${shipment.id}`)} className="hover:text-gray-900">
            Shipment {shipment.shipmentNumber}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Cargo Classification</span>
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

        {/* Cargo Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Cars</p>
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{carStats.cars}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Trucks</p>
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{carStats.trucks}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Others</p>
              <Box className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{carStats.others}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Units</p>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{carStats.totalUnits}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Weight</p>
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{carStats.totalWeight.toLocaleString()} kg</p>
          </div>
        </div>

        {/* Classification Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cargo Type Classification</h2>
              <p className="text-sm text-gray-600">AI-classified cargo types with confidence scores</p>
            </div>
            <Button variant="outline">View Audit Trail</Button>
          </div>

          <CargoClassificationTable items={cargoItems} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push(`/shipments/${shipment.id}/validation`)}>
            Back to Validation
          </Button>
          <Button onClick={handleProceedToManifest}>Proceed to Manifest Generation</Button>
        </div>
      </div>
    </div>
  )
}
