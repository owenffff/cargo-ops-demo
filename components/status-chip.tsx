import { cn } from "@/lib/utils"
import { Check, Clock, X, FileText, Ship, Anchor } from "lucide-react"

interface StatusChipProps {
  status:
    | "completed"
    | "pending"
    | "rejected"
    | "in-progress"
    | "berth-confirmation"
    | "pre-submission"
    | "portnet-submission"
    | "pre-arrival-validation"
    | "discharge-summary"
    | "vessel-arrival"
  label?: string
  size?: "sm" | "md"
}

export function StatusChip({ status, label, size = "md" }: StatusChipProps) {
  const config = {
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: Check,
      defaultLabel: "Completed",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: Clock,
      defaultLabel: "Pending",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: X,
      defaultLabel: "Rejected",
    },
    "in-progress": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: Clock,
      defaultLabel: "In Progress",
    },
    "berth-confirmation": {
      bg: "bg-cyan-100",
      text: "text-cyan-700",
      icon: Anchor,
      defaultLabel: "Berth Confirmation",
    },
    "pre-submission": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: FileText,
      defaultLabel: "Pre-Submission",
    },
    "portnet-submission": {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      icon: FileText,
      defaultLabel: "PortNet Submission",
    },
    "pre-arrival-validation": {
      bg: "bg-purple-100",
      text: "text-purple-700",
      icon: Ship,
      defaultLabel: "Pre-Arrival Validation",
    },
    "discharge-summary": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: Anchor,
      defaultLabel: "Discharge Summary",
    },
    "vessel-arrival": {
      bg: "bg-teal-100",
      text: "text-teal-700",
      icon: Ship,
      defaultLabel: "Unberthing",
    },
  }

  const { bg, text, icon: Icon, defaultLabel } = config[status]
  const displayLabel = label || defaultLabel

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-medium", bg, text, sizeClasses)}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {displayLabel}
    </span>
  )
}
