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
  const createField = (label: string, value: string, confidence: number): ExtractedBLField => ({
    label,
    value,
    originalValue: value, // Store original AI-extracted value
    confidence,
    editable: true,
    isModified: false,
    isFlagged: false,
    comments: [],
  })

  // Fixed vehicle list matching the example
  const descriptionLines = `ELANTRA
288 Units
SONA GEN
368 Units
TUCSON
388 Units
IX35
240 Units
STAGEA
11 Units
SANTFE/TIXUSII REV
116 Units`

  return {
    blNo: createField("BL No", "HDGLKRAU0635562", 100),
    shipperExporter: createField("Shipper/Exporter", "HYUNDAI MOTOR COMPANY, SEOUL, KOREA", 100),
    consignee: createField(
      "Consignee",
      "HYUNDAI MOTOR COMPANY AUSTRALIA PTY LTD, CNR OF 548 LANE COVE RD & HYUNDAI DRIVE, MACQUARIE PARK NSW 2113, PARIS",
      75,
    ),
    notifyParty: createField(
      "Notify Party",
      "10-12-2025 HYUNDAI MOTOR COMPANY AUSTRALIA PTY LTD, CNR OF 394 LANE COVE RD & HYUNDAI DRIVE, MACQUARIE PARK NSW 2113, PARIS",
      75,
    ),
    oceanVessel: createField("Ocean Vessel", "GLOVIS SOLOMON", 100),
    voyageNo: createField("Voyage No", "075", 100),
    portOfLoading: createField("Port of Loading", "PYUNGTAEK, KOREA", 100),
    portOfDischarge: createField("Port of Discharge", "FREMANTLE, AUSTRALIA", 100),
    marksAndNumbers: createField("Marks and Numbers", "HMCA FREMANTLE\nAUSTRALIA CNO. **\nMADE IN KOREA", 100),
    descriptionOfGoods: createField("Description of Goods & Kind of Packages", descriptionLines, 100),
    numberOfPackages: createField("No. & Kind of Packages", "1,411 Units", 100),
    grossWeight: createField("Gross Weight", "199,426 KGS", 70),
    measurement: createField("Measurement", "1,767.178 CBM", 70),
    freightPrepaidAt: createField("Freight Prepaid At", "SEOUL, KOREA", 100),
    dateOfIssue: createField("Date of Issue", "JUN. 30, 2025 (SEOUL, KOREA)", 100),
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
