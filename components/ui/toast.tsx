"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createRoot } from "react-dom/client"

export interface ToastProps {
  variant?: "error" | "warning" | "info" | "success"
  title: string
  description?: string
  onClose?: () => void
}

const variantStyles = {
  error: "bg-red-100 border-red-200 text-red-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  info: "bg-blue-100 border-blue-200 text-blue-900",
  success: "bg-green-100 border-green-200 text-green-900",
}

const iconStyles = {
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  success: "bg-green-500",
}

export function Toast({ variant = "info", title, description, onClose }: ToastProps) {
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md", variantStyles[variant])}>
      <div className={cn("flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0", iconStyles[variant])}>
        {variant === "error" && <span className="text-white font-bold text-lg">!</span>}
        {variant === "warning" && <span className="text-white font-bold text-lg">!</span>}
        {variant === "info" && <span className="text-white font-bold text-lg">i</span>}
        {variant === "success" && <span className="text-white font-bold text-xl">✓</span>}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

let toastContainer: HTMLDivElement | null = null

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

export function showToast({
  type,
  title,
  description,
}: { type: ToastProps["variant"]; title: string; description?: string }) {
  const container = getToastContainer()
  const toastId = `toast-${Date.now()}`

  const toastWrapper = document.createElement("div")
  toastWrapper.id = toastId
  toastWrapper.className = "animate-in slide-in-from-right"

  container.appendChild(toastWrapper)

  const root = createRoot(toastWrapper)
  root.render(
    <Toast
      variant={type}
      title={title}
      description={description}
      onClose={() => {
        toastWrapper.remove()
        root.unmount()
      }}
    />,
  )

  setTimeout(() => {
    toastWrapper.remove()
    root.unmount()
  }, 5000)
}
