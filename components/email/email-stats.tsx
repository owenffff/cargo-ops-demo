"use client"

import { Mail, CheckCircle2, Clock } from "lucide-react"
import type { Email } from "@/types"

interface EmailStatsProps {
  emails: Email[]
}

export function EmailStats({ emails }: EmailStatsProps) {
  const stats = {
    total: emails.length,
    pending: emails.filter((e) => e.status === "read" && !e.aiProcessed).length,
    processed: emails.filter((e) => e.status === "processed").length,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Emails</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending Processing</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{stats.processed}</p>
            <p className="text-sm text-gray-600">Processed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
