"use client"

import { useState } from "react"
import { Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailListItem } from "@/components/email/email-list-item"
import { EmailStats } from "@/components/email/email-stats"
import { mockEmails } from "@/lib/mock-data"
import type { EmailStatus } from "@/types"

export default function EmailsPage() {
  const [emails] = useState(mockEmails)
  const [filterStatus, setFilterStatus] = useState<EmailStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmails = emails.filter((email) => {
    const matchesStatus = filterStatus === "all" || email.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Inbox</h1>
                <p className="text-sm text-gray-600">AI-powered document extraction from emails</p>
              </div>
            </div>
            <Button className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Emails
            </Button>
          </div>
        </div>

        {/* Stats */}
        <EmailStats emails={emails} />

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "unread" ? "default" : "outline"}
                onClick={() => setFilterStatus("unread")}
                size="sm"
              >
                Unread
              </Button>
              <Button
                variant={filterStatus === "processed" ? "default" : "outline"}
                onClick={() => setFilterStatus("processed")}
                size="sm"
              >
                Processed
              </Button>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredEmails.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No emails found</p>
            </div>
          ) : (
            <div>
              {filteredEmails.map((email) => (
                <EmailListItem key={email.id} email={email} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
