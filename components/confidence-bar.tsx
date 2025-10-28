import { cn } from "@/lib/utils"

interface ConfidenceBarProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ConfidenceBar({ score, showLabel = true, size = "md" }: ConfidenceBarProps) {
  const getColor = (score: number) => {
    if (score >= 85) return "bg-green-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-2.5",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex-1 bg-gray-200 rounded-full overflow-hidden", heights[size])}>
        <div className={cn("h-full transition-all duration-300", getColor(score))} style={{ width: `${score}%` }} />
      </div>
      {showLabel && <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">{score}%</span>}
    </div>
  )
}
