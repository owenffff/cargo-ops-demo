import type { ManifestData, AuditEntry, Shipment } from "@/types"

// Generate EDI 8401-like flat file (mock format)
export function generateEDIFile(manifest: ManifestData): string {
  const lines: string[] = []

  // Header
  lines.push(`UNB+UNOC:3+${manifest.manifestNumber}+PORTNET+${new Date().toISOString()}+1'`)
  lines.push(`UNH+1+IFTMCS:D:00B:UN'`)

  // Vessel and voyage details
  lines.push(`BGM+85+${manifest.manifestNumber}+9'`)
  lines.push(`DTM+137:${manifest.eta}:203'`)
  lines.push(`TDT+20+${manifest.voyageNumber}++1:${manifest.vesselName}'`)

  // Port information
  lines.push(`LOC+5+${manifest.portOfLoading}'`)
  lines.push(`LOC+61+${manifest.portOfDischarge}'`)

  // Cargo items
  manifest.cargoItems.forEach((item, index) => {
    lines.push(`CNI+${index + 1}+${item.blNumber}'`)
    lines.push(`MEA+AAE+WT+KGM:${item.weight}'`)
    lines.push(`QTY+1:${item.units}'`)
    lines.push(`FTX+AAA+++${item.cargoType}'`)
  })

  // Trailer
  lines.push(`UNT+${lines.length + 1}+1'`)
  lines.push(`UNZ+1+1'`)

  return lines.join("\n")
}

// Generate CSV export for discharge summary
export function generateDischargeSummaryCSV(manifest: ManifestData): string {
  const headers = ["BL Number", "Cargo Type", "Origin", "Destination", "Status", "Units", "Weight (kg)"]

  const rows = manifest.cargoItems.map((item) => [
    item.blNumber,
    item.cargoType,
    item.origin,
    item.destination,
    item.cargoStatus,
    item.units.toString(),
    item.weight.toString(),
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

// Generate audit trail export
export function generateAuditTrailCSV(entries: AuditEntry[]): string {
  const headers = ["Timestamp", "User", "Action", "Details", "Hash", "Previous Hash"]

  const rows = entries.map((entry) => [
    entry.timestamp,
    entry.user,
    entry.action,
    entry.details,
    entry.hash,
    entry.previousHash,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csvContent
}

// Download helper
export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV rows
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value ?? "")
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }),
  )

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Download the file
  downloadFile(csvContent, filename, "text/csv")
}

// Generate shipment summary report
export function generateShipmentReport(shipment: Shipment, manifest?: ManifestData): string {
  const lines: string[] = []

  lines.push("=".repeat(60))
  lines.push("SHIPMENT SUMMARY REPORT")
  lines.push("=".repeat(60))
  lines.push("")
  lines.push(`Shipment Number: ${shipment.shipmentNumber}`)
  lines.push(`Vessel Name: ${shipment.vesselName}`)
  lines.push(`ETA: ${shipment.eta}`)
  lines.push(`Ship Principal: ${shipment.shipPrincipal}`)
  lines.push(`Status: ${shipment.status}`)
  lines.push(`Created On: ${shipment.createdOn}`)
  lines.push("")

  if (manifest) {
    lines.push("-".repeat(60))
    lines.push("MANIFEST DETAILS")
    lines.push("-".repeat(60))
    lines.push(`Manifest Number: ${manifest.manifestNumber}`)
    lines.push(`Total Units: ${manifest.totalUnits}`)
    lines.push(`Total Weight: ${manifest.totalWeight} kg`)
    lines.push(`Cargo Items: ${manifest.cargoItems.length}`)
    lines.push("")
  }

  lines.push("-".repeat(60))
  lines.push("WORKFLOW STAGES")
  lines.push("-".repeat(60))
  lines.push(`Pre-submission: ${shipment.stages.preSubmission ? "✓ Complete" : "○ Pending"}`)
  lines.push(`PortNet Submission: ${shipment.stages.portnetSubmission ? "✓ Complete" : "○ Pending"}`)
  lines.push(`Pre-Arrival Validation: ${shipment.stages.preArrivalValidation ? "✓ Complete" : "○ Pending"}`)
  lines.push(`Discharge Summary: ${shipment.stages.dischargeSummary ? "✓ Complete" : "○ Pending"}`)
  lines.push(`Vessel Arrival: ${shipment.stages.vesselArrival ? "✓ Complete" : "○ Pending"}`)
  lines.push("")
  lines.push("=".repeat(60))
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push("=".repeat(60))

  return lines.join("\n")
}
