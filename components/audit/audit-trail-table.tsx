"use client"

import type { AuditEntry } from "@/types"
import { Shield } from "lucide-react"

interface AuditTrailTableProps {
  entries: AuditEntry[]
  showVerification?: boolean
}

export function AuditTrailTable({ entries, showVerification = true }: AuditTrailTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Details
              </th>
              {showVerification && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hash</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry, index) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-700">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">{entry.user.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{entry.user}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-md truncate">{entry.details}</td>
                {showVerification && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-600 font-mono">{entry.hash.substring(0, 8)}...</code>
                      <Shield className="w-4 h-4 text-green-600" title="Verified" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
