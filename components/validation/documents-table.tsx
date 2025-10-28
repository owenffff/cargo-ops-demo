"use client"

import type { Document } from "@/types"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Eye, Download, Trash2, Edit } from "lucide-react"

interface DocumentsTableProps {
  documents: Document[]
  onView?: (doc: Document) => void
  onEdit?: (doc: Document) => void
  onDownload?: (doc: Document) => void
  onDelete?: (doc: Document) => void
}

export function DocumentsTable({ documents, onView, onEdit, onDownload, onDelete }: DocumentsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Document Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                AI Confidence Score (Extraction)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Number of Units per BL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{doc.documentName}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-xs">
                    <ConfidenceBar score={doc.aiConfidenceScore} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{doc.lastUpdated}</td>
                <td className="px-4 py-4 text-sm text-gray-700 text-center">{doc.numberOfUnits || "-"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(doc)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(doc)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDownload && (
                      <button
                        onClick={() => onDownload(doc)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(doc)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
