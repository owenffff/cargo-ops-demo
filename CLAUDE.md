# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cargo Operations System** - an AI-assisted cargo operations management platform built with Next.js 15. The application manages the full lifecycle of shipping cargo operations, from email ingestion through Unberthing, with AI-powered document extraction and validation.

## Development Commands

### Setup and Running
```bash
npm install              # Install dependencies
npm run dev             # Start development server on localhost:3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

### TypeScript Configuration
- The project uses TypeScript with strict mode enabled
- Path alias `@/*` maps to the root directory
- **Important**: `next.config.mjs` has `ignoreBuildErrors: true` - this is for demo purposes only

## Architecture Overview

### Application Structure

This is a **Next.js App Router** application with the following architecture:

#### Core Workflow Stages
The application follows a 5-stage cargo operations workflow:
1. **Pre-Submission** - Initial document upload and AI extraction
2. **PortNet Submission** - Generate and submit EDI manifest to authorities
3. **Pre-Arrival Validation** - Cross-validation of BL, VIN lists, and cargo allocation
4. **Discharge Summary** - Cargo classification and discharge planning
5. **Unberthing** - Final arrival confirmation and audit trail

#### Data Flow
- **Client-side only**: All data is stored in `localStorage` (no backend)
- **State Management**: React hooks + `LocalStorage` utility class in `lib/storage.ts`
- **Mock Data**: Initialized from `lib/mock-data.ts` on first load
- **Persistence**: Data merges on reload - new mock shipments are added without overwriting existing localStorage data

#### Key Data Entities (see `types/index.ts`)
- `Shipment` - Core entity with workflow stages and status
- `Document` - Uploaded documents with AI confidence scores
- `BillOfLading` - Extracted BL data with match scores
- `CargoItem` - Individual cargo units with classification
- `ManifestData` - EDI manifest for PortNet submission
- `Email` - Incoming emails with attachment processing
- `AuditEntry` - Blockchain-style audit trail with hash chaining

### Directory Structure

```
app/                          # Next.js app router pages
  layout.tsx                  # Root layout with sidebar + header
  page.tsx                    # Homepage with shipments table, alerts, stats
  shipments/
    [id]/                     # Dynamic shipment detail routes
      page.tsx                # Shipment overview
      validation/             # Stage 3: Document validation
      manifest/               # Stage 2: Manifest creation
      classification/         # Stage 4: Cargo classification
      portnet-submission/     # Stage 2: EDI submission
      discharge/              # Stage 4: Discharge planning
      pre-arrival/            # Stage 3: Pre-arrival checks
      vessel-arrival/         # Stage 5: Arrival confirmation
      audit/                  # Audit trail viewer
  emails/                     # Email inbox with attachment extraction
  documents/                  # Document library grouped by shipment
  settings/                   # Settings with demo reset

components/
  layout/                     # Sidebar and Header components
  shipment/                   # ProgressStepper, ShipmentDetailsCard
  validation/                 # BL validation tables
  manifest/                   # Manifest form and comment history
  cargo/                      # Cargo classification table
  email/                      # Email list and draft modal
  documents/                  # Document cards and groups
  audit/                      # Audit trail table
  ui/                         # shadcn/ui components (60+ components)

lib/
  storage.ts                  # LocalStorage wrapper class
  mock-data.ts                # Mock shipments, alerts, documents, emails
  mock-cargo.ts               # Mock cargo item generation
  mock-extract.ts             # AI extraction simulation
  mock-tolerance.ts           # Tolerance checking for validation
  mock-map-hi.ts             # HI (House Information) field mapping
  audit-trail.ts              # Blockchain-style audit trail class
  export-utils.ts             # EDI, CSV export generators
  utils.ts                    # Tailwind merge utility

types/
  index.ts                    # All TypeScript type definitions
```

### UI Component Library

The project uses **shadcn/ui** components with Radix UI primitives and Tailwind CSS v4. All UI components are in `components/ui/` and can be used directly. Common components:
- Forms: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`
- Data: `Table`, `Card`, `Badge`, `Tabs`
- Feedback: `Toast`, `Dialog`, `AlertDialog`, `Sheet`, `Drawer`
- Charts: `Chart` component (wraps Recharts)

### State Management Patterns

#### LocalStorage Pattern
```typescript
// Reading data
const shipments = LocalStorage.getShipments()
const documents = LocalStorage.getDocuments(shipmentId)

// Writing data
LocalStorage.setShipments(updatedShipments)
LocalStorage.setDocuments(shipmentId, updatedDocuments)

// Resetting (use with caution)
LocalStorage.resetAll()
```

#### Shipment State Updates
When updating a shipment's status or stages:
1. Load all shipments from `LocalStorage.getShipments()`
2. Find and modify the specific shipment
3. Save entire array back with `LocalStorage.setShipments()`
4. Update local component state

#### Audit Trail Pattern
```typescript
import { auditTrail } from "@/lib/audit-trail"

// Always log user actions
auditTrail.addEntry(
  "Ryan",  // user
  "Updated Manifest",  // action
  `Shipment ${shipmentId}: Changed total units from 100 to 120`  // details
)
```

### AI Confidence Scoring

Documents have `aiConfidenceScore` (0-100) representing extraction confidence:
- **High (95-100)**: Green, auto-proceed
- **Medium (<95)**: Amber/Yellow, pending review (manual review required)

Use `<ConfidenceBar value={score} />` component to display scores consistently.

**Note:** The system uses a strict 95% threshold. Any document below 95% is flagged as "Pending Review" and shows amber/yellow coloring to indicate it requires manual verification before proceeding.

### Validation and Tolerance Checking

The validation stage cross-checks documents:
- **BL vs BL List**: Match BL numbers and unit counts
- **BL vs VIN List**: Validate VIN counts per BL
- **Cargo Allocation vs BL**: Check total unit tolerance

See `lib/mock-tolerance.ts` for tolerance checking implementation (default 5% deviation).

### Export and Submission

#### EDI 8401 Format
```typescript
import { generateEDIFile, downloadFile } from "@/lib/export-utils"

const ediContent = generateEDIFile(manifest)
downloadFile(ediContent, `EDI_${manifest.manifestNumber}.txt`)
```

#### CSV Exports
```typescript
import { generateDischargeSummaryCSV, exportToCSV } from "@/lib/export-utils"

// Pre-formatted exports
const csvContent = generateDischargeSummaryCSV(manifest)

// Generic export from objects
exportToCSV(dataArray, "filename.csv")
```

### Email Processing Flow

1. User views inbox at `/emails`
2. AI pre-processes emails and detects attachments
3. User extracts documents from email attachments
4. Documents are linked to shipments and added to validation stage
5. Email status changes: `unread` → `read` → `processed` → `archived`

### Routing Patterns

#### Dynamic Routes
```typescript
// Navigate to shipment detail
router.push(`/shipments/${shipmentId}`)

// Navigate to workflow stage
router.push(`/shipments/${shipmentId}/validation`)
router.push(`/shipments/${shipmentId}/manifest`)
```

#### Accessing Route Params
```typescript
const params = useParams()
const shipmentId = params.id as string
```

### Styling Conventions

- **Tailwind CSS v4**: Use utility classes
- **Color Scheme**:
  - Blue: Primary actions, active states
  - Green: Success, completed stages
  - Yellow: Warnings, medium confidence
  - Red: Errors, low confidence
  - Gray: Neutral, disabled states
- **Layout**: Fixed sidebar (80px) + fixed header (64px), main content with `ml-20 mt-16`
- **Responsive**: Mobile breakpoints use `md:` prefix

### Common Patterns

#### Loading Shipment Data in Pages
```typescript
const [shipment, setShipment] = useState<Shipment | null>(null)

useEffect(() => {
  const shipments = LocalStorage.getShipments()
  const found = shipments.find((s) => s.id === params.id)
  if (found) setShipment(found)
}, [params.id])
```

#### Toast Notifications
```typescript
import { toast } from "sonner"

toast.success("Manifest submitted successfully")
toast.error("Validation failed")
toast.info("Processing document...")
```

#### Stage Completion
When a user completes a workflow stage:
1. Update shipment's `stages` object
2. Update shipment's `status` if moving to next stage
3. Add audit trail entry
4. Show success toast
5. Navigate to next stage or back to shipment overview

## Important Notes

- **No Backend**: This is a demo application with all data in localStorage
- **TypeScript Errors**: Build errors are ignored in config - fix them when working on production features
- **AI Simulation**: All "AI" features are mocked with seeded random confidence scores
- **Images**: Image optimization is disabled (`unoptimized: true`)
- **Demo Reset**: Settings page has a "Reset Demo" button that clears all localStorage
- **User Context**: Hardcoded user "Ryan" with role "Admin" (see `LocalStorage.getCurrentUser()`)

## Feature Development Guidelines

### Adding a New Workflow Stage
1. Define new status in `types/index.ts` `ShipmentStatus` type
2. Add stage boolean to `Shipment.stages` interface
3. Update `ProgressStepper` component to show new stage
4. Create new page at `app/shipments/[id]/[new-stage]/page.tsx`
5. Update navigation logic in shipment overview

### Adding Document Types
1. Add type to `DocumentType` union in `types/index.ts`
2. Update mock document generation in `lib/mock-data.ts`
3. Add extraction logic in `lib/mock-extract.ts`
4. Update validation logic if cross-checking is needed

### Adding Export Formats
Add new generator function to `lib/export-utils.ts` following patterns:
- `generateEDIFile()` for structured text formats
- `generateDischargeSummaryCSV()` for CSV with custom formatting
- `exportToCSV()` for generic object-to-CSV conversion

## Testing and Debugging

- Use browser DevTools localStorage inspector to view stored data
- Check audit trail at `/shipments/[id]/audit` to debug state changes
- Reset demo data from Settings page if state becomes corrupted
- Mock data is deterministic (seeded random) for consistent testing
