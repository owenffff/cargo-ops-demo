import type { AuditEntry } from "@/types"

// Simple hash function for browser (demo-grade)
function simpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(16, "0")
}

export class AuditTrail {
  private entries: AuditEntry[] = []
  private storageKey: string

  constructor(storageKey = "audit-trail") {
    this.storageKey = storageKey
    this.loadFromStorage()
  }

  addEntry(user: string, action: string, details: string): AuditEntry {
    const previousHash = this.entries.length > 0 ? this.entries[this.entries.length - 1].hash : "0000000000000000"

    const timestamp = new Date().toISOString()
    const dataToHash = `${timestamp}|${user}|${action}|${details}|${previousHash}`
    const hash = simpleHash(dataToHash)

    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp,
      user,
      action,
      details,
      hash,
      previousHash,
    }

    this.entries.push(entry)
    this.saveToStorage()
    return entry
  }

  getEntries(): AuditEntry[] {
    return [...this.entries]
  }

  getEntriesForShipment(shipmentId: string): AuditEntry[] {
    return this.entries.filter((entry) => entry.details.includes(shipmentId))
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.entries.length; i++) {
      const entry = this.entries[i]
      const previousEntry = this.entries[i - 1]

      if (entry.previousHash !== previousEntry.hash) {
        return false
      }
    }
    return true
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.entries))
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        try {
          this.entries = JSON.parse(stored)
        } catch (e) {
          console.error("Failed to load audit trail from storage", e)
          this.entries = []
        }
      }
    }
  }

  reset(): void {
    this.entries = []
    this.saveToStorage()
  }
}

// Global audit trail instance
export const auditTrail = new AuditTrail()
