import type { DocumentType, ExtractedBLFields, ExtractedBLField } from "@/types"
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

// Generate comprehensive extracted BL fields with individual confidence scores
export function generateExtractedBLFields(seed: string, shipmentId: string): ExtractedBLFields {
  const baseConfidence = generateConfidence(seed, "high")
  const blNumber = `KMTC${shipmentId.replace("-", "")}${Math.floor(Math.random() * 9000) + 1000}`

  const createField = (label: string, value: string, confidenceVariance: number = 0): ExtractedBLField => ({
    label,
    value,
    originalValue: value, // Store original AI-extracted value
    confidence: Math.min(100, Math.max(85, baseConfidence + confidenceVariance)),
    editable: true,
    isModified: false,
    isFlagged: false,
    comments: [],
  })

  return {
    blNumber: createField("BL Number", blNumber, 0),
    date: createField("BL Date", new Date(2025, 7, Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), -2),
    vesselName: createField("Vessel Name", "Pacific Glory", 1),
    voyageNumber: createField("Voyage Number", `V.${Math.floor(Math.random() * 900) + 100}`, -1),
    shipperName: createField("Shipper Name", "Hyundai Motor Company", 0),
    shipperAddress: createField("Shipper Address", "12-1 Ulsan, Ulsan Metropolitan City, South Korea, 44720", -3),
    shipperContact: createField("Shipper Contact", "+82-52-202-3114", -2),
    consigneeName: createField("Consignee Name", "Komoco Motors Pte Ltd", -1),
    consigneeAddress: createField("Consignee Address", "3 Leng Kee Road, Singapore 159088", -4),
    consigneeContact: createField("Consignee Contact", "+65-6473-8933", -2),
    notifyParty: createField("Notify Party", "Komoco Motors Pte Ltd - Same as Consignee", 0),
    portOfLoading: createField("Port of Loading", "Ulsan, South Korea (KRULS)", 1),
    portOfDischarge: createField("Port of Discharge", "Singapore (SGSIN)", 0),
    placeOfDelivery: createField("Place of Delivery", "Singapore (SGSIN)", -1),
    numberOfUnits: createField("Number of Units", String(Math.floor(Math.random() * 8) + 3), -2),
    weight: createField("Gross Weight", `${(Math.random() * 30 + 15).toFixed(2)} MT`, -3),
    volume: createField("Volume (CBM)", `${(Math.random() * 80 + 40).toFixed(2)} CBM`, -4),
    containerNumbers: createField("Container Numbers", `TCLU${Math.floor(Math.random() * 9000000) + 1000000}0`, -5),
    cargoDescription: createField("Cargo Description", "SAID TO CONTAIN: NEW MOTOR VEHICLES - HYUNDAI MODELS", 0),
    freightTerms: createField("Freight Terms", "PREPAID", 1),
    specialInstructions: createField("Special Instructions", "Handle with care. Deliver to designated yard area.", -6),
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
