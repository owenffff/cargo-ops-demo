import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: "blue" | "yellow" | "green" | "red"
}

const colorStyles = {
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
