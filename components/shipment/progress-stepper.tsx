"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ShipmentStatus } from "@/types"
import Link from "next/link"

interface Step {
  id: ShipmentStatus
  label: string
  completed: boolean
  active: boolean
}

interface ProgressStepperProps {
  currentStatus: ShipmentStatus
  stages: {
    berthConfirmation: boolean
    preSubmission: boolean
    portnetSubmission: boolean
    preArrivalValidation: boolean
    dischargeSummary: boolean
    vesselArrival: boolean
  }
  shipmentId?: string
}

export function ProgressStepper({ currentStatus, stages, shipmentId = "" }: ProgressStepperProps) {
  const getStepRoute = (stepId: ShipmentStatus): string => {
    const routes: Record<ShipmentStatus, string> = {
      "berth-confirmation": `/shipments/${shipmentId}/berth-confirmation`,
      "pre-submission": `/shipments/${shipmentId}/validation`,
      "portnet-submission": `/shipments/${shipmentId}/portnet-submission`,
      "pre-arrival-validation": `/shipments/${shipmentId}/pre-arrival`,
      "discharge-summary": `/shipments/${shipmentId}/discharge`,
      "vessel-arrival": `/shipments/${shipmentId}/vessel-arrival`,
      completed: `/shipments/${shipmentId}/vessel-arrival`,
    }
    return routes[stepId]
  }

  const steps: Step[] = [
    {
      id: "berth-confirmation",
      label: "Berth Confirmation",
      completed: stages.berthConfirmation,
      active: currentStatus === "berth-confirmation",
    },
    {
      id: "pre-submission",
      label: "Pre-submission",
      completed: stages.preSubmission,
      active: currentStatus === "pre-submission",
    },
    {
      id: "portnet-submission",
      label: "PortNet Submission",
      completed: stages.portnetSubmission,
      active: currentStatus === "portnet-submission",
    },
    {
      id: "pre-arrival-validation",
      label: "Cargo Pre-Arrival Validation",
      completed: stages.preArrivalValidation,
      active: currentStatus === "pre-arrival-validation",
    },
    {
      id: "discharge-summary",
      label: "Discharge Summary",
      completed: stages.dischargeSummary,
      active: currentStatus === "discharge-summary",
    },
    {
      id: "vessel-arrival",
      label: "Vessel Arrival",
      completed: stages.vesselArrival,
      active: currentStatus === "vessel-arrival",
    },
  ]

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 relative">
              {/* Step column - centered */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Step indicator */}
                <Link
                  href={getStepRoute(step.id)}
                  className="group cursor-pointer"
                  prefetch={true}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      "group-hover:scale-110 group-hover:shadow-md",
                      step.completed
                        ? "bg-green-500 border-green-500"
                        : step.active
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300",
                    )}
                  >
                    {step.completed ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : step.active ? (
                      <Circle className="w-4 h-4 text-white fill-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </Link>

                {/* Label directly under icon */}
                <Link href={getStepRoute(step.id)} className="group cursor-pointer" prefetch={true}>
                  <span
                    className={cn(
                      "text-xs mt-2 text-center max-w-[100px] block group-hover:text-blue-600 transition-colors",
                      step.completed || step.active ? "text-gray-900 font-medium" : "text-gray-500",
                    )}
                  >
                    {step.label}
                  </span>
                </Link>
              </div>

              {/* Connector line - positioned at circle level */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2" style={{ marginTop: '20px' }}>
                  <div className={cn("h-full", step.completed ? "bg-green-500" : "bg-gray-300")} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
