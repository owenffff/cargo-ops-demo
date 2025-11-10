"use client"

import { Search, Filter } from "lucide-react"

interface ShipmentsFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function ShipmentsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ShipmentsFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by shipment number, vessel name, or principal..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="pre-submission">Pre-submission</option>
            <option value="portnet-submission">PortNet Submission</option>
            <option value="cargo-validation">Cargo Validation</option>
            <option value="discharge-summary">Discharge Summary</option>
            <option value="vessel-arrival">Unberthing</option>
          </select>
        </div>
      </div>
    </div>
  )
}
