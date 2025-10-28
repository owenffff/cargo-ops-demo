"use client"

import { useEffect, useState } from "react"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ShipmentsStats } from "@/components/shipments/shipments-stats"
import { ShipmentsFilters } from "@/components/shipments/shipments-filters"
import { EnhancedShipmentsTable } from "@/components/shipments/enhanced-shipments-table"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { exportToCSV } from "@/lib/export-utils"

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const storedShipments = LocalStorage.getShipments()
    setShipments(storedShipments)
    setFilteredShipments(storedShipments)
  }, [])

  useEffect(() => {
    let filtered = shipments

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.shipmentNumber.toLowerCase().includes(query) ||
          s.vesselName.toLowerCase().includes(query) ||
          s.shipPrincipal.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    setFilteredShipments(filtered)
  }, [searchQuery, statusFilter, shipments])

  const handleExport = () => {
    const data = filteredShipments.map((s) => ({
      "Shipment Number": s.shipmentNumber,
      "Vessel Name": s.vesselName,
      "Ship Principal": s.shipPrincipal,
      ETA: s.eta,
      Status: s.status,
      "Created On": s.createdOn,
      "Change of Destination": s.changeOfDestination || "NIL",
    }))

    exportToCSV(data, `shipments-export-${new Date().toISOString().split("T")[0]}.csv`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipments</h1>
              <p className="text-gray-600">View and manage all cargo shipments</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Manual Shipment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <ShipmentsStats shipments={shipments} />

        {/* Filters */}
        <ShipmentsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Table */}
        <EnhancedShipmentsTable shipments={filteredShipments} />

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredShipments.length} of {shipments.length} shipments
        </div>
      </div>
    </div>
  )
}
