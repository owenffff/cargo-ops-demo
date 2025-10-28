"use client"

import { Ship, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Shipment } from "@/types"

interface ShipmentsStatsProps {
  shipments: Shipment[]
}

export function ShipmentsStats({ shipments }: ShipmentsStatsProps) {
  const totalShipments = shipments.length
  const completed = shipments.filter((s) => s.status === "completed").length
  const inProgress = totalShipments - completed
  const needsAttention = shipments.filter((s) => {
    // Check if any stage has low confidence or issues
    return s.status === "pre-submission" || s.status === "pre-arrival-validation"
  }).length

  const stats = [
    {
      label: "Total Shipments",
      value: totalShipments,
      icon: Ship,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Needs Attention",
      value: needsAttention,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
