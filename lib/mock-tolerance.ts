import type { ToleranceCheck } from "@/types"

export interface ToleranceConfig {
  weightTolerancePct: number
  cbmTolerancePct: number
}

export const defaultToleranceConfig: ToleranceConfig = {
  weightTolerancePct: 5,
  cbmTolerancePct: 5,
}

export function checkTolerances(
  actualWeight: number,
  expectedWeight: number,
  actualCbm: number,
  expectedCbm: number,
  config: ToleranceConfig = defaultToleranceConfig,
): ToleranceCheck[] {
  const checks: ToleranceCheck[] = []

  // Weight check
  const weightDeviation = Math.abs(((actualWeight - expectedWeight) / expectedWeight) * 100)
  checks.push({
    field: "weight",
    expected: expectedWeight,
    actual: actualWeight,
    tolerance: config.weightTolerancePct,
    deviation: weightDeviation,
    passed: weightDeviation <= config.weightTolerancePct,
  })

  // CBM check
  const cbmDeviation = Math.abs(((actualCbm - expectedCbm) / expectedCbm) * 100)
  checks.push({
    field: "cbm",
    expected: expectedCbm,
    actual: actualCbm,
    tolerance: config.cbmTolerancePct,
    deviation: cbmDeviation,
    passed: cbmDeviation <= config.cbmTolerancePct,
  })

  return checks
}

export function allTolerancesPassed(checks: ToleranceCheck[]): boolean {
  return checks.every((check) => check.passed || check.overrideReason)
}
