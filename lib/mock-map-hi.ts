import type { HIField, CargoStatus } from "@/types"
import { generateConfidence } from "./mock-data"

// Mock mapping to PortNet Handling Instruction (HI) A-G fields
export function mockMapToHI(extractedData: Record<string, any>, cargoStatus: CargoStatus = "L"): HIField[] {
  const seed = JSON.stringify(extractedData)

  const baseFields: HIField[] = [
    {
      field: "blNumber",
      label: "BL Number",
      value: extractedData.blNumber || "",
      confidence: generateConfidence(seed + "blNumber", "high"),
      editable: false,
      required: true,
    },
    {
      field: "shipper",
      label: "Shipper",
      value: extractedData.shipper || "",
      confidence: generateConfidence(seed + "shipper", "high"),
      editable: true,
      required: true,
    },
    {
      field: "consignee",
      label: "Consignee",
      value: extractedData.consignee || "",
      confidence: generateConfidence(seed + "consignee", "high"),
      editable: true,
      required: true,
    },
    {
      field: "vesselName",
      label: "Vessel Name",
      value: extractedData.vesselName || "",
      confidence: generateConfidence(seed + "vesselName", "high"),
      editable: true,
      required: true,
    },
    {
      field: "voyageNumber",
      label: "Voyage Number",
      value: extractedData.voyageNumber || "",
      confidence: generateConfidence(seed + "voyageNumber", "high"),
      editable: true,
      required: true,
    },
    {
      field: "portOfLoading",
      label: "Port of Loading",
      value: extractedData.portOfLoading || "",
      confidence: generateConfidence(seed + "portOfLoading", "high"),
      editable: true,
      required: true,
    },
    {
      field: "portOfDischarge",
      label: "Port of Discharge",
      value: extractedData.portOfDischarge || "",
      confidence: generateConfidence(seed + "portOfDischarge", "high"),
      editable: true,
      required: true,
    },
    {
      field: "placeOfDelivery",
      label: "Place of Delivery",
      value: extractedData.placeOfDelivery || "",
      confidence: generateConfidence(seed + "placeOfDelivery", "medium"),
      editable: true,
      required: false,
    },
    {
      field: "cargoDescription",
      label: "Cargo Description",
      value: extractedData.cargoDescription || "",
      confidence: generateConfidence(seed + "cargoDescription", "high"),
      editable: true,
      required: true,
    },
    {
      field: "numberOfUnits",
      label: "Number of Units",
      value: extractedData.numberOfUnits?.toString() || "",
      confidence: generateConfidence(seed + "numberOfUnits", "high"),
      editable: true,
      required: true,
    },
    {
      field: "grossWeight",
      label: "Gross Weight (kg)",
      value: extractedData.grossWeight?.toString() || "",
      confidence: generateConfidence(seed + "grossWeight", "medium"),
      editable: true,
      required: true,
    },
    {
      field: "cbm",
      label: "CBM",
      value: extractedData.cbm?.toString() || "",
      confidence: generateConfidence(seed + "cbm", "medium"),
      editable: true,
      required: true,
    },
    {
      field: "cargoStatus",
      label: "Cargo Status (L/T)",
      value: cargoStatus,
      confidence: 100,
      editable: true,
      required: true,
    },
  ]

  // Add conditional fields based on cargo status
  if (cargoStatus === "L") {
    baseFields.push(
      {
        field: "notifyParty",
        label: "Notify Party",
        value: extractedData.notifyParty || "",
        confidence: generateConfidence(seed + "notifyParty", "high"),
        editable: true,
        required: true,
      },
      {
        field: "loaRef",
        label: "LOA Reference",
        value: extractedData.loaRef || "",
        confidence: generateConfidence(seed + "loaRef", "medium"),
        editable: true,
        required: false,
      },
    )
  } else {
    baseFields.push(
      {
        field: "truckingCo",
        label: "Trucking Company",
        value: extractedData.truckingCo || "",
        confidence: generateConfidence(seed + "truckingCo", "medium"),
        editable: true,
        required: true,
      },
      {
        field: "onwardVessel",
        label: "Onward Vessel",
        value: extractedData.onwardVessel || "",
        confidence: generateConfidence(seed + "onwardVessel", "high"),
        editable: true,
        required: true,
      },
    )
  }

  return baseFields
}

// Check if any field needs review (confidence < threshold)
export function needsReview(fields: HIField[], threshold = 85): boolean {
  return fields.some((field) => field.confidence < threshold)
}
