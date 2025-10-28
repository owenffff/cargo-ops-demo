"use client"

import { useState, useEffect } from "react"
import { FileText, Mail, Upload, Search, Filter, Download } from "lucide-react"
import { ShipmentDocumentsGroup } from "@/components/documents/shipment-documents-group"
import { LocalStorage } from "@/lib/storage"
import { mockShipments, mockDocuments, mockEmails } from "@/lib/mock-data"
import type { Document } from "@/types"

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSource, setFilterSource] = useState<"all" | "email" | "manual">("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [shipmentDocuments, setShipmentDocuments] = useState<
    Record<
      string,
      {
        shipmentNumber: string
        vesselName: string
        documents: (Document & {
          source?: "email" | "manual"
          emailFrom?: string
          extractedAt?: string
        })[]
      }
    >
  >({})

  useEffect(() => {
    // Load shipments and documents
    const shipments = LocalStorage.getShipments()
    const shipmentsToUse = shipments.length > 0 ? shipments : mockShipments

    const grouped: typeof shipmentDocuments = {}

    shipmentsToUse.forEach((shipment) => {
      const docs = LocalStorage.getDocuments(shipment.id)
      const docsToUse = docs.length > 0 ? docs : mockDocuments[shipment.id] || []

      // Find email for this shipment to get source info
      const shipmentEmail = mockEmails.find((e) => e.shipmentId === shipment.id)

      // Enhance documents with source information
      const enhancedDocs = docsToUse.map((doc) => ({
        ...doc,
        source: "email" as const,
        emailFrom: shipmentEmail?.from,
        extractedAt: shipmentEmail?.receivedAt,
      }))

      if (enhancedDocs.length > 0) {
        grouped[shipment.id] = {
          shipmentNumber: shipment.shipmentNumber,
          vesselName: shipment.vesselName,
          documents: enhancedDocs,
        }
      }
    })

    setShipmentDocuments(grouped)
  }, [])

  // Calculate statistics
  const totalDocuments = Object.values(shipmentDocuments).reduce((sum, group) => sum + group.documents.length, 0)
  const emailDocuments = Object.values(shipmentDocuments).reduce(
    (sum, group) => sum + group.documents.filter((d) => d.source === "email").length,
    0,
  )
  const manualDocuments = Object.values(shipmentDocuments).reduce(
    (sum, group) => sum + group.documents.filter((d) => d.source === "manual").length,
    0,
  )
  const lowConfidenceDocs = Object.values(shipmentDocuments).reduce(
    (sum, group) => sum + group.documents.filter((d) => d.aiConfidenceScore < 95).length,
    0,
  )

  // Filter documents
  const filteredShipments = Object.entries(shipmentDocuments)
    .map(([id, group]) => {
      const filteredDocs = group.documents.filter((doc) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.vesselName.toLowerCase().includes(searchQuery.toLowerCase())

        // Source filter
        const matchesSource = filterSource === "all" || doc.source === filterSource

        // Type filter
        const matchesType = filterType === "all" || doc.documentType === filterType

        return matchesSearch && matchesSource && matchesType
      })

      return { id, group: { ...group, documents: filteredDocs } }
    })
    .filter(({ group }) => group.documents.length > 0)

  // Get unique document types for filter
  const documentTypes = Array.from(
    new Set(Object.values(shipmentDocuments).flatMap((group) => group.documents.map((d) => d.documentType))),
  )

  return (
    <div className="min-h-screen bg-gray-50 pl-20 pt-16">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">All shipment documents extracted from emails and manual uploads</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{totalDocuments}</span>
            </div>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{emailDocuments}</span>
            </div>
            <p className="text-sm text-gray-600">From Emails</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Upload className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{manualDocuments}</span>
            </div>
            <p className="text-sm text-gray-600">Manual Uploads</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">{lowConfidenceDocs}</span>
            </div>
            <p className="text-sm text-gray-600">Need Review</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, shipments, vessels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as typeof filterSource)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="email">Email Only</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Documents by Shipment */}
        <div className="space-y-4">
          {filteredShipments.length > 0 ? (
            filteredShipments.map(({ id, group }) => (
              <ShipmentDocumentsGroup
                key={id}
                shipmentNumber={group.shipmentNumber}
                vesselName={group.vesselName}
                documents={group.documents}
              />
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchQuery || filterSource !== "all" || filterType !== "all"
                  ? "Try adjusting your filters"
                  : "Documents will appear here once extracted from emails"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
