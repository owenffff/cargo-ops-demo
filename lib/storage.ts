import type { Shipment, Alert, Document } from "@/types"

const STORAGE_KEYS = {
  SHIPMENTS: "cargo-ops-shipments",
  ALERTS: "cargo-ops-alerts",
  DOCUMENTS: "cargo-ops-documents",
  USER: "cargo-ops-user",
} as const

export class LocalStorage {
  static getShipments(): Shipment[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.SHIPMENTS)
    return data ? JSON.parse(data) : []
  }

  static setShipments(shipments: Shipment[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments))
  }

  static getAlerts(): Alert[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS)
    return data ? JSON.parse(data) : []
  }

  static setAlerts(alerts: Alert[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
  }

  static getDocuments(shipmentId: string): Document[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(`${STORAGE_KEYS.DOCUMENTS}-${shipmentId}`)
    return data ? JSON.parse(data) : []
  }

  static setDocuments(shipmentId: string, documents: Document[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`${STORAGE_KEYS.DOCUMENTS}-${shipmentId}`, JSON.stringify(documents))
  }

  static getDocument(shipmentId: string, documentId: string): Document | null {
    if (typeof window === "undefined") return null
    const documents = this.getDocuments(shipmentId)
    return documents.find((doc) => doc.id === documentId) || null
  }

  static deleteDocument(shipmentId: string, documentId: string): void {
    if (typeof window === "undefined") return
    const documents = this.getDocuments(shipmentId)
    const filtered = documents.filter((doc) => doc.id !== documentId)
    this.setDocuments(shipmentId, filtered)
  }

  static updateDocument(shipmentId: string, documentId: string, updates: Partial<Document>): void {
    if (typeof window === "undefined") return
    const documents = this.getDocuments(shipmentId)
    const updated = documents.map((doc) => (doc.id === documentId ? { ...doc, ...updates } : doc))
    this.setDocuments(shipmentId, updated)
  }

  static getCurrentUser(): { name: string; role: string } {
    if (typeof window === "undefined") return { name: "Ryan", role: "Admin" }
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : { name: "Ryan", role: "Admin" }
  }

  static setCurrentUser(user: { name: string; role: string }): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  static resetAll(): void {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    // Also clear audit trail
    localStorage.removeItem("audit-trail")
  }
}
