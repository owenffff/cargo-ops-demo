import type { CargoItem, ManifestData } from "@/types"
import { generateConfidence } from "./mock-data"

export function generateMockCargoItems(shipmentId: string, blNumbers: string[]): CargoItem[] {
  const cargoTypes: Array<"Car" | "Truck" | "Other"> = ["Car", "Truck", "Other"]
  const origins = ["Ulsan, South Korea", "Busan, South Korea", "Tokyo, Japan"]
  const destinations = ["Singapore", "Jakarta, Indonesia", "Manila, Philippines"]
  const statuses: Array<"Transshipment" | "Local"> = ["Transshipment", "Local"]

  return blNumbers.map((blNumber, index) => {
    const seed = `${shipmentId}-${blNumber}`
    const cargoType = cargoTypes[index % cargoTypes.length]

    return {
      id: `cargo-${Date.now()}-${index}`,
      blNumber,
      cargoType,
      origin: origins[index % origins.length],
      destination: destinations[index % destinations.length],
      cargoStatus: statuses[index % statuses.length],
      units: Math.floor(Math.random() * 10) + 1,
      weight: Math.floor(Math.random() * 5000) + 1000,
      aiConfidence: generateConfidence(seed, "high"),
    }
  })
}

export function generateMockManifest(shipmentId: string, cargoItems: CargoItem[]): ManifestData {
  const totalUnits = cargoItems.reduce((sum, item) => sum + item.units, 0)
  const totalWeight = cargoItems.reduce((sum, item) => sum + item.weight, 0)

  return {
    id: `manifest-${shipmentId}`,
    shipmentId,
    manifestNumber: `MF${shipmentId.replace("-", "")}`,
    vesselName: "Jiuyang Bonanza",
    voyageNumber: "V.007",
    portOfLoading: "Ulsan, South Korea",
    portOfDischarge: "Singapore",
    eta: "1st Oct 2025, 14:00",
    totalUnits,
    totalWeight,
    cargoItems,
    status: "draft",
    comments: [],
  }
}
