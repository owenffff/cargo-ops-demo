"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types"
import { LocalStorage } from "@/lib/storage"
import { ProgressStepper } from "@/components/shipment/progress-stepper"
import { ShipmentDetailsCard } from "@/components/shipment/shipment-details-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, SlidersHorizontal, Download } from "lucide-react"
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

  const dischargeData = [
    {
      blNo: "18007404329",
      vesselName: "Adria Ace",
      voyageNo: "0148A",
      eta: "21/10/2025",
      portOfLoading: "SHANGHAI",
      cargoStatus: "T/S - ADELAIDE",
      marksNumbers: "KIA AUSTRALIA",
      qty: "9 UTS",
      cargoDescription: "KIA EV5 VEHS",
      totalWeight: "19.07Ts",
      totalMeasurement: "135.01m³",
      vinChassisNo: "TMAH151DVTJ254224",
    },
    {
      blNo: "18007404308",
      vesselName: "Adria Ace",
      voyageNo: "0148A",
      eta: "21/10/2025",
      portOfLoading: "SHANGHAI",
      cargoStatus: "T/S - FREMANTLE",
      marksNumbers: "KIA AUSTRALIA",
      qty: "46 UTS",
      cargoDescription: "KIA EV5 VEHS",
      totalWeight: "97.48Ts",
      totalMeasurement: "690.05m³",
      vinChassisNo: "TMAH151DVTJ254224",
    },
    {
      blNo: "18007490332",
      vesselName: "Adria Ace",
      voyageNo: "0148A",
      eta: "21/10/2025",
      portOfLoading: "SHANGHAI",
      cargoStatus: "T/S - FREMANTLE",
      marksNumbers: "KIA AUSTRALIA",
      qty: "2 UTS",
      cargoDescription: "KIA EV5 VEHS",
      totalWeight: "4.26Ts",
      totalMeasurement: "30.00m³",
      vinChassisNo: "TMAH151DVTJ254224",
    },
    {
      blNo: "18007153619",
      vesselName: "Wisdom Ace",
      voyageNo: "0094A",
      eta: "13/10/2025",
      portOfLoading: "SHANGHAI",
      cargoStatus: "T/S - PORT LOUIS",
      marksNumbers: "NIL",
      qty: "35 UTS",
      cargoDescription: "GREAT WALL A02 = 17 / B16 = 8 / TANK 300 = 10 VEHS",
      totalWeight: "65.07Ts",
      totalMeasurement: "558.24m³",
      vinChassisNo: "VIN5544332211",
    },
    {
      blNo: "18007448543",
      vesselName: "Wisdom Ace",
      voyageNo: "0094A",
      eta: "13/10/2025",
      portOfLoading: "SHANGHAI",
      cargoStatus: "T/S - DURBAN",
      marksNumbers: "NIL",
      qty: "1 UT",
      cargoDescription: "TOYOTA LC VEH",
      totalWeight: "2.47Ts",
      totalMeasurement: "28.35m³",
      vinChassisNo: "VIN6677889900",
    },
    {
      blNo: "18007374538",
      vesselName: "World Spirit",
      voyageNo: "0311A",
      eta: "15/10/2025",
      portOfLoading: "NAGOYA",
      cargoStatus: "T/S - LAEM CHABANG",
      marksNumbers: "RMA AUTOMATIVE",
      qty: "9 UTS",
      cargoDescription: "TOYOTA HIACE COMMUTER VAN",
      totalWeight: "21.83Ts",
      totalMeasurement: "171.24m³",
      vinChassisNo: "VIN0099887766",
    },
    {
      blNo: "18007374559",
      vesselName: "World Spirit",
      voyageNo: "0311A",
      eta: "15/10/2025",
      portOfLoading: "NAGOYA",
      cargoStatus: "T/S - LAEM CHABANG",
      marksNumbers: "RMA AUTOMATIVE",
      qty: "26 UTS",
      cargoDescription: "TOYOTA HIACE COMMUTER VAN",
      totalWeight: "64.40Ts",
      totalMeasurement: "496.39m³",
      vinChassisNo: "VIN1100998877",
    },
    {
      blNo: "18007376206",
      vesselName: "World Spirit",
      voyageNo: "0311A",
      eta: "15/10/2025",
      portOfLoading: "NAGOYA",
      cargoStatus: "T/S - LAEM CHABANG",
      marksNumbers: "RMA AUTOMATIVE",
      qty: "24 UTS",
      cargoDescription: "TOYOTA HIACE COMMUTER VAN",
      totalWeight: "58.68Ts",
      totalMeasurement: "412.90m³",
      vinChassisNo: "VIN2233445566",
    },
    {
      blNo: "18007396178",
      vesselName: "Lake Annecy",
      voyageNo: "0011A",
      eta: "10/10/2025",
      portOfLoading: "YOKOHAMA",
      cargoStatus: "T/S - XINGANG",
      marksNumbers: "MONNIS ULAANBAATAR",
      qty: "1 UT",
      cargoDescription: "NISSAN Y63 VEH",
      totalWeight: "2.82Ts",
      totalMeasurement: "22.23m³",
      vinChassisNo: "VIN6655443322",
    },
    {
      blNo: "18007446540",
      vesselName: "Lake Annecy",
      voyageNo: "0011A",
      eta: "10/10/2025",
      portOfLoading: "YOKOHAMA",
      cargoStatus: "T/S - XINGANG",
      marksNumbers: "MONNIS ULAANBAATAR",
      qty: "2 UTS",
      cargoDescription: "NISSAN Y63 VEH",
      totalWeight: "5.64Ts",
      totalMeasurement: "44.46m³",
      vinChassisNo: "VIN778899001",
    },
    {
      blNo: "18007427453",
      vesselName: "Lake Annecy",
      voyageNo: "0011A",
      eta: "10/10/2025",
      portOfLoading: "YOKOHAMA",
      cargoStatus: "T/S - XINGANG",
      marksNumbers: "MONNIS ULAANBAATAR",
      qty: "2 UTS",
      cargoDescription: "NISSAN T334 VEH",
      totalWeight: "3.73Ts",
      totalMeasurement: "30.05m³",
      vinChassisNo: "VIN778899001",
    },
  ]

  const cargoBreakdown = [
    { description: "T/S - ADELAIDE + KIA VEHS", qty: "8", location: "BLK D 1 B 3B - 38" },
    { description: "T/S - FREMANTLE + KIA VEHS", qty: "48", location: "BLK D 1 B 3B - 38" },
    { description: "T/S - FREMANTLE + KIA VEHS", qty: "46", location: "BLK D 5 B - 38" },
    { description: "T/S - PORT LOUIS + GREAT WALL MNG2 VEHS", qty: "35", location: "BLK D 1 B 34 -35" },
    { description: "T/S - DURBAN + TOYOTA VEH", qty: "1", location: "BLK D 3 B 41 -51" },
    { description: "T/S - LAJM CHABAUD + TOYOTA VAN", qty: "59", location: "BLK D 1 B 1 - 3" },
    { description: "T/S - KINGSAN + NISSAN MNG2 MAD", qty: "3", location: "BLK D 1 B 2 - 3" },
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

        <ShipmentDetailsCard shipment={shipment} />

        {/* Discharge Summary Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6 mb-6">
          {/* Header with Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Discharge Summary</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="text" placeholder="Search" className="pl-9 pr-4 w-64 h-9" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Main Discharge Data Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">BL No.</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Vessel Name</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Voyage No</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">ETA</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Port of Loading</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                    Cargo Status - Port of Discharge
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Marks and Numbers</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Qty</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Cargo Description</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">Total Weight</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                    Total Measurement (m³)
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">VIN/Chassis No.</th>
                </tr>
              </thead>
              <tbody>
                {dischargeData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-900">{item.blNo}</td>
                    <td className="py-3 px-3 text-gray-900">{item.vesselName}</td>
                    <td className="py-3 px-3 text-gray-900">{item.voyageNo}</td>
                    <td className="py-3 px-3 text-gray-900">{item.eta}</td>
                    <td className="py-3 px-3 text-gray-900">{item.portOfLoading}</td>
                    <td className="py-3 px-3 text-gray-900">{item.cargoStatus}</td>
                    <td className="py-3 px-3 text-gray-900">{item.marksNumbers}</td>
                    <td className="py-3 px-3 text-gray-900">{item.qty}</td>
                    <td className="py-3 px-3 text-gray-900">{item.cargoDescription}</td>
                    <td className="py-3 px-3 text-gray-900">{item.totalWeight}</td>
                    <td className="py-3 px-3 text-gray-900">{item.totalMeasurement}</td>
                    <td className="py-3 px-3 text-gray-900">{item.vinChassisNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cargo Breakdown Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-3 font-semibold text-gray-900">Cargo Description</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-900">Qty</th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-900">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoBreakdown.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-3 text-gray-900">{item.description}</td>
                      <td className="py-3 px-3 text-blue-600">{item.qty}</td>
                      <td className="py-3 px-3 text-gray-900">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Discharge Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
