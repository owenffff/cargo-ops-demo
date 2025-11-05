// Core domain types for the cargo operations system

export type ShipmentStatus =
  | "berth-confirmation"
  | "pre-submission"
  | "portnet-submission"
  | "pre-arrival-validation"
  | "discharge-summary"
  | "vessel-arrival"
  | "completed"

export type OpsType = "Bunkering" | "Discharge" | "Loading"

export type CargoStatus = "L" | "T" // Local or Transshipment

export type AlertType = "error" | "warning" | "info" | "success"

export type DocumentType = "BL" | "BL_LIST" | "VIN_LIST" | "PORTNET" | "CONNECTION" | "YARD_PLAN" | "LOA" | "MANIFEST"

export interface Shipment {
  id: string
  shipmentNumber: string
  transactionStartTime: string
  vesselName: string
  eta: string
  shipPrincipal: string
  changeOfDestination: string | null
  status: ShipmentStatus
  createdOn: string
  opsTypes: OpsType[]
  stages: {
    berthConfirmation: boolean
    preSubmission: boolean
    portnetSubmission: boolean
    preArrivalValidation: boolean
    dischargeSummary: boolean
    vesselArrival: boolean
  }
}

export type DocumentProcessingStatus = "uploaded" | "processing" | "ready" | "error"

export type DocumentReviewStatusType = "pending_review" | "in_review" | "approved" | "rejected"

export interface DocumentReviewStatus {
  status: DocumentReviewStatusType
  reviewer?: string
  reviewedAt?: string
  reviewNotes?: string
  fieldsModified: number
  fieldsFlagged: number
}

export interface FieldComment {
  id: string
  user: string
  comment: string
  timestamp: string
}

export interface ExtractedBLField {
  label: string
  value: string
  originalValue: string // AI-extracted value (never changes)
  confidence: number
  editable: boolean
  isModified: boolean // true if value !== originalValue
  isFlagged: boolean // flagged for review
  comments: FieldComment[] // field-level comments
  modifiedBy?: string
  modifiedAt?: string
}

export interface ExtractedBLFields {
  blNumber: ExtractedBLField
  date: ExtractedBLField
  vesselName: ExtractedBLField
  voyageNumber: ExtractedBLField
  shipperName: ExtractedBLField
  shipperAddress: ExtractedBLField
  shipperContact: ExtractedBLField
  consigneeName: ExtractedBLField
  consigneeAddress: ExtractedBLField
  consigneeContact: ExtractedBLField
  notifyParty: ExtractedBLField
  portOfLoading: ExtractedBLField
  portOfDischarge: ExtractedBLField
  placeOfDelivery: ExtractedBLField
  numberOfUnits: ExtractedBLField
  weight: ExtractedBLField
  volume: ExtractedBLField
  containerNumbers: ExtractedBLField
  cargoDescription: ExtractedBLField
  freightTerms: ExtractedBLField
  specialInstructions: ExtractedBLField
}

export interface Document {
  id: string
  shipmentId: string
  documentName: string
  documentType: DocumentType
  aiConfidenceScore: number
  lastUpdated: string
  numberOfUnits?: number
  fileUrl?: string
  processingStatus?: DocumentProcessingStatus
  extractedFields?: ExtractedBLFields
  fileData?: string // base64 encoded file data
  reviewStatus?: DocumentReviewStatus
  locked?: boolean // locked from edits after approval
}

export interface BillOfLading extends Document {
  blNumber: string
  units: number
  matchScoreBL?: number
  matchScoreVIN?: number
}

export interface Alert {
  id: string
  type: AlertType
  title: string
  description: string
  shipmentNumber?: string
  timestamp: string
  dismissed: boolean
}

export interface CargoAllocationPlan {
  id: string
  shipmentId: string
  totalUnits: number
  aiConfidenceScore: number
  documentName: string
}

export interface HIField {
  field: string
  label: string
  value: string
  confidence: number
  editable: boolean
  required: boolean
}

export interface ValidationCheck {
  id: string
  name: string
  status: "pass" | "fail" | "pending"
  message: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  hash: string
  previousHash: string
}

export interface ToleranceCheck {
  field: string
  expected: number
  actual: number
  tolerance: number
  deviation: number
  passed: boolean
  overrideReason?: string
}

export interface CargoItem {
  id: string
  blNumber: string
  cargoType: "Car" | "Truck" | "Other"
  origin: string
  destination: string
  cargoStatus: "Transshipment" | "Local"
  units: number
  weight: number
  aiConfidence: number
}

export interface ManifestData {
  id: string
  shipmentId: string
  manifestNumber: string
  vesselName: string
  voyageNumber: string
  portOfLoading: string
  portOfDischarge: string
  eta: string
  totalUnits: number
  totalWeight: number
  cargoItems: CargoItem[]
  status: "draft" | "submitted" | "acknowledged" | "rejected"
  submittedAt?: string
  acknowledgedAt?: string
  comments: ManifestComment[]
}

export interface ManifestComment {
  id: string
  user: string
  comment: string
  timestamp: string
  action: "review" | "approve" | "reject" | "comment"
}

export type EmailStatus = "unread" | "read" | "processed" | "archived"
export type EmailPriority = "high" | "normal" | "low"
export type EmailCategory = "Bunkering" | "Discharge" | "Loading" | "Documentation" | "Notification" | "General"

export interface EmailAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  documentType?: DocumentType
  aiConfidenceScore?: number
  extracted: boolean
}

export interface Email {
  id: string
  from: string
  to: string
  subject: string
  body: string
  receivedAt: string
  status: EmailStatus
  priority: EmailPriority
  shipmentId?: string
  attachments: EmailAttachment[]
  hasShipmentDocuments: boolean
  aiProcessed: boolean
  tags: string[]
  category?: EmailCategory
}

export interface EmailThread {
  id: string
  shipmentId: string
  emails: Email[]
  participants: string[]
  lastActivity: string
}

export interface EmailDraft {
  to: string
  cc?: string
  subject: string
  body: string
  template?: string
  attachments?: string[]
}
