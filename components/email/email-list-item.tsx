"use client"

import { Paperclip, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import type { Email } from "@/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EmailListItemProps {
  email: Email
}

export function EmailListItem({ email }: EmailListItemProps) {
  const getStatusIcon = () => {
    if (email.status === "processed") {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />
    } else if (email.status === "unread") {
      return <AlertCircle className="w-4 h-4 text-orange-600" />
    } else {
      return <Clock className="w-4 h-4 text-blue-600" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Bunkering":
        return "bg-orange-100 text-orange-700"
      case "Discharge":
        return "bg-purple-100 text-purple-700"
      case "Loading":
        return "bg-cyan-100 text-cyan-700"
      case "Documentation":
        return "bg-blue-100 text-blue-700"
      case "Notification":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const href = email.shipmentId ? `/shipments/${email.shipmentId}` : `/emails/${email.id}`

  return (
    <Link
      href={href}
      className={cn(
        "block p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors",
        email.status === "unread" && "bg-blue-50",
      )}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-1">{getStatusIcon()}</div>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <p className={cn("text-sm font-medium text-gray-900", email.status === "unread" && "font-semibold")}>
                {email.from}
              </p>
              <p className={cn("text-sm text-gray-900 mt-1", email.status === "unread" && "font-semibold")}>
                {email.subject}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">{email.receivedAt}</span>
              {email.category && (
                <span className={cn("px-2 py-1 text-xs rounded-md font-medium", getCategoryColor(email.category))}>
                  {email.category}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{email.body}</p>

          {/* Tags and Attachments */}
          <div className="flex items-center gap-3 flex-wrap">
            {email.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="w-3 h-3" />
                <span>
                  {email.attachments.length} attachment{email.attachments.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            {email.tags.map((tag, index) => {
              const tagColors: Record<string, string> = {
                "Shipment Docs": "bg-blue-100 text-blue-700",
                "AI Processed": "bg-green-100 text-green-700",
                Pending: "bg-yellow-100 text-yellow-700",
                Outgoing: "bg-indigo-100 text-indigo-700",
              }

              // Shipment number tags (e.g., "2025-001")
              if (tag.match(/^\d{4}-\d{3}$/)) {
                return (
                  <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {tag}
                  </span>
                )
              }

              return (
                <span
                  key={index}
                  className={cn("px-2 py-0.5 text-xs rounded-full", tagColors[tag] || "bg-gray-100 text-gray-700")}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
