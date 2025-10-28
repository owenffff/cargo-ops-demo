"use client"

import type { ManifestData } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ManifestFormProps {
  manifest: ManifestData
  onChange: (manifest: ManifestData) => void
  readOnly?: boolean
}

export function ManifestForm({ manifest, onChange, readOnly = false }: ManifestFormProps) {
  const handleChange = (field: keyof ManifestData, value: any) => {
    onChange({ ...manifest, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="manifestNumber">Manifest Number</Label>
          <Input
            id="manifestNumber"
            value={manifest.manifestNumber}
            onChange={(e) => handleChange("manifestNumber", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="vesselName">Vessel Name</Label>
          <Input
            id="vesselName"
            value={manifest.vesselName}
            onChange={(e) => handleChange("vesselName", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="voyageNumber">Voyage Number</Label>
          <Input
            id="voyageNumber"
            value={manifest.voyageNumber}
            onChange={(e) => handleChange("voyageNumber", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="eta">ETA</Label>
          <Input
            id="eta"
            value={manifest.eta}
            onChange={(e) => handleChange("eta", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="portOfLoading">Port of Loading</Label>
          <Input
            id="portOfLoading"
            value={manifest.portOfLoading}
            onChange={(e) => handleChange("portOfLoading", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="portOfDischarge">Port of Discharge</Label>
          <Input
            id="portOfDischarge"
            value={manifest.portOfDischarge}
            onChange={(e) => handleChange("portOfDischarge", e.target.value)}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="totalUnits">Total Units</Label>
          <Input
            id="totalUnits"
            type="number"
            value={manifest.totalUnits}
            onChange={(e) => handleChange("totalUnits", Number.parseInt(e.target.value))}
            disabled={readOnly}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="totalWeight">Total Weight (kg)</Label>
          <Input
            id="totalWeight"
            type="number"
            value={manifest.totalWeight}
            onChange={(e) => handleChange("totalWeight", Number.parseInt(e.target.value))}
            disabled={readOnly}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}
