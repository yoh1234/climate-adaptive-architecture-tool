/**
 * timeline.ts — Determines the cutoff year a building remains resilient against flooding,
 * given a sea level rise scenario and base flood elevation (BFE).
 *
 * This module analyzes how long a building design can withstand projected flood levels,
 * by comparing the building's elevation to sea level rise + BFE over time.
 *
 * Inputs:
 * - totalElevation: the building's actual elevation in feet (above sea level)
 * - bfeFt: base flood elevation for the neighborhood
 * - scenario: name of sea level rise projection to use (e.g., "1.0 - HIGH")
 *
 * Output:
 * - Year (number) at which the building is projected to be overtopped
 */

import { seaLevelRiseScenarios } from '@/domain/seaLevelScenarios';

export function getCutoffYear({
  totalElevationFt,
  bfeFt,
  scenario = '1.0 - HIGH',
}: {
  totalElevationFt: number;
  bfeFt: number;
  scenario?: string;
}): number {
  const scenarioData = seaLevelRiseScenarios[scenario];

  if (!scenarioData) {
    throw new Error(`Unknown sea level scenario: ${scenario}`);
  }

  for (const [yearStr, seaLevelRiseFt] of Object.entries(scenarioData)) {
    const floodLineFt = bfeFt + seaLevelRiseFt;
    if (totalElevationFt < floodLineFt) {
      return parseInt(yearStr, 10);
    }
  }

  return Math.max(...Object.keys(scenarioData).map(Number)); // Safe through last modeled year
}