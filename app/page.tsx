"use client"

import { useEffect, useState } from "react"
import type { Shipment, Alert } from "@/types"
import { mockShipments, mockAlerts } from "@/lib/mock-data"
import { LocalStorage } from "@/lib/storage"
import { ShipmentsTable } from "@/components/homepage/shipments-table"
import { AlertCard } from "@/components/homepage/alert-card"
import { StatsCard } from "@/components/homepage/stats-card"
import { ShipmentsStats } from "@/components/shipments/shipments-stats"
import { FileText, Clock, CheckCircle, XCircle, Package, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [user, setUser] = useState({ name: "Ryan", role: "Admin" })

  useEffect(() => {
    let storedShipments = LocalStorage.getShipments()

    // If empty, initialize with mock data
    if (storedShipments.length === 0) {
      LocalStorage.setShipments(mockShipments)
      storedShipments = mockShipments
    } else {
      // Migrate old shipments to add opsTypes if missing
      const migratedShipments = storedShipments.map((shipment) => {
        if (!shipment.opsTypes) {
          return { ...shipment, opsTypes: ["Bunkering", "Discharge", "Loading"] }
        }
        return shipment
      })

      // Merge: add any mock shipments that don't exist in stored data
      const storedIds = new Set(migratedShipments.map((s) => s.id))
      const newMockShipments = mockShipments.filter((ms) => !storedIds.has(ms.id))

      if (newMockShipments.length > 0 || migratedShipments.length !== storedShipments.length) {
        const mergedShipments = [...migratedShipments, ...newMockShipments]
        LocalStorage.setShipments(mergedShipments)
        storedShipments = mergedShipments
      } else {
        storedShipments = migratedShipments
      }
    }

    let storedAlerts = LocalStorage.getAlerts()
    if (storedAlerts.length === 0) {
      LocalStorage.setAlerts(mockAlerts)
      storedAlerts = mockAlerts
    } else {
      // Merge alerts as well
      const storedAlertIds = new Set(storedAlerts.map((a) => a.id))
      const newMockAlerts = mockAlerts.filter((ma) => !storedAlertIds.has(ma.id))

      if (newMockAlerts.length > 0) {
        const mergedAlerts = [...storedAlerts, ...newMockAlerts]
        LocalStorage.setAlerts(mergedAlerts)
        storedAlerts = mergedAlerts
      }
    }

    setShipments(storedShipments)
    setAlerts(storedAlerts.filter((a) => !a.dismissed))
    setUser(LocalStorage.getCurrentUser())
  }, [])

  const handleDismissAlert = (id: string) => {
    const updatedAlerts = LocalStorage.getAlerts().map((alert) =>
      alert.id === id ? { ...alert, dismissed: true } : alert,
    )
    LocalStorage.setAlerts(updatedAlerts)
    setAlerts(updatedAlerts.filter((a) => !a.dismissed))
  }

  const openShipmentCount = shipments.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Here's an overview of your open shipments and system alerts</p>
        </div>

        <ShipmentsStats shipments={shipments} />

        {/* Open Shipments Count */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Open Shipment (Count: {openShipmentCount})</h2>
              <p className="text-sm text-gray-600">Active shipments requiring attention</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Manual Shipment
          </Button>
        </div>

        {/* Shipments Table */}
        <div className="mb-8">
          <ShipmentsTable shipments={shipments} />
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
              ))}
            </div>
          </div>
        )}

        {/* Change of Destination Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Change of Destination Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard title="Total CODs" value={100} icon={FileText} color="blue" />
            <StatsCard title="Pending" value={20} icon={Clock} color="yellow" />
            <StatsCard title="Completed" value={75} icon={CheckCircle} color="green" />
            <StatsCard title="Rejected" value={5} icon={XCircle} color="red" />
          </div>
        </div>

        {/* Cargo Units Summary */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cargo Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard title="Total No of Cargo Units (In Port)" value={12000} icon={Package} color="blue" />
            <StatsCard title="Total No of Cargo Units (incoming)" value={15000} icon={TrendingUp} color="green" />
          </div>
        </div>
      </div>
    </div>
  )
}
