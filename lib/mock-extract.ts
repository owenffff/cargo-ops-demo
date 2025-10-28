import type { DocumentType } from "@/types"
import { generateConfidence } from "./mock-data"

// Mock extraction logic for different document types
export function mockExtractDocument(
  documentType: DocumentType,
  fileName: string,
  content?: string,
): Record<string, any> {
  const seed = `${documentType}-${fileName}`

  switch (documentType) {
    case "BL":
      return extractBL(seed)
    case "BL_LIST":
      return extractBLList(seed)
    case "VIN_LIST":
      return extractVINList(seed)
    case "PORTNET":
      return extractPortNet(seed)
    case "YARD_PLAN":
      return extractYardPlan(seed)
    default:
      return {}
  }
}

function extractBL(seed: string) {
  return {
    blNumber: `HDGL${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    shipper: "Hyundai Motor Company",
    consignee: "Komoco Motors Pte Ltd",
    notifyParty: "Komoco Motors Pte Ltd",
    vesselName: "Jiuyang Bonanza",
    voyageNumber: "V.007",
    portOfLoading: "Ulsan, South Korea",
    portOfDischarge: "Singapore",
    placeOfDelivery: "Singapore",
    numberOfUnits: Math.floor(Math.random() * 10) + 1,
    cargoDescription: "Motor Vehicles",
    grossWeight: Math.floor(Math.random() * 50000) + 10000,
    cbm: Math.floor(Math.random() * 100) + 20,
    confidence: generateConfidence(seed, "high"),
  }
}

function extractBLList(seed: string) {
  return {
    blNumbers: ["HDGLCNS0634447", "HDGLCNS0634567", "HDGLCNS0634571", "HDGLKRAU0635562", "HDGLKRB0635738"],
    totalUnits: 23,
    confidence: generateConfidence(seed, "high"),
  }
}

function extractVINList(seed: string) {
  return {
    vins: ["KMHXX00XXXX000001", "KMHXX00XXXX000002", "KMHXX00XXXX000003"],
    totalUnits: 23,
    confidence: generateConfidence(seed, "high"),
  }
}

function extractPortNet(seed: string) {
  return {
    manifestNumber: "MF2025001",
    vesselName: "Jiuyang Bonanza",
    voyageNumber: "V.007",
    eta: "2025-10-01T14:00:00",
    confidence: generateConfidence(seed, "high"),
  }
}

function extractYardPlan(seed: string) {
  return {
    yardLocation: "Yard A",
    totalSlots: 100,
    occupiedSlots: 75,
    confidence: generateConfidence(seed, "medium"),
  }
}
