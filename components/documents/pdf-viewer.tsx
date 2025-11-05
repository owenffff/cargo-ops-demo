"use client"

import { FileText } from "lucide-react"

interface PDFViewerProps {
  fileData: string
  fileName: string
}

export function PDFViewer({ fileData, fileName }: PDFViewerProps) {
  // Check if fileData is valid
  const isValidPDF = fileData && fileData.startsWith("data:")

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">{fileName}</span>
        </div>
        <span className="text-xs text-gray-500">PDF Document</span>
      </div>

      {/* PDF Content using native browser viewer */}
      <div className="flex-1 overflow-hidden">
        {isValidPDF ? (
          <iframe src={fileData} className="w-full h-full border-0" title={fileName} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No PDF data available</p>
              <p className="text-sm text-gray-500 mt-2">Please upload a PDF file</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
