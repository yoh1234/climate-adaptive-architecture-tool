/**
 * scoring.ts — Calculates the resilience score and cutoff year for a building design.
 *
 * This service takes structured building inputs (e.g., elevation, materials, mitigation features)
 * and returns a composite resilience score (0–100) as well as the projected cutoff year
 * beyond which the building may no longer withstand flooding under a chosen sea level rise scenario.
 *
 * Inputs:
 * - BuildingInput: user-selected parameters such as foundation type, elevation, and neighborhood
 * - Sea level rise projections (mocked scenarios)
 * - Base Flood Elevation (BFE) data by neighborhood
 *
 * Outputs:
 * - resilienceScore: Aggregated score based on individual design elements
 * - cutoffYear: The year when projected sea level + BFE overtakes the building's elevation
 * - breakdown: A component-wise breakdown of score contributions
 *
 * Notes:
 * - Uses "1.0 - HIGH" scenario by default for cutoff simulation.
 * - All scoring weights are mock values intended to simulate real-world risk prioritization.
 */

import { BuildingInput, ScoreBreakdown } from '@/domain/types';
import { foundationScores } from '@/domain/foundationScores';
import { elevationScore } from '@/domain/elevationScore';
import { materialLibrary } from '@/domain/materials';
import { mitigationFeatures } from '@/domain/mitigationFeatures';
import { bfeByNeighborhood } from '@/domain/bfeByNeighborhood';
import { seaLevelRiseScenarios } from '@/domain/seaLevelScenarios';

export interface ScoringResult {
  resilienceScore: number;
  cutoffYear: number;
  breakdown: ScoreBreakdown;
}

const DEFAULT_SCENARIO = '1.0 - HIGH';

export function calculateScore(input: BuildingInput): ScoringResult {
  const { elevationFt, foundationType, material, mitigationFeatures: features, neighborhood } = input;

  const bfeData = bfeByNeighborhood[neighborhood];
  const seaLevels = seaLevelRiseScenarios[DEFAULT_SCENARIO];

  const netElevation = elevationFt - bfeData.bfeFt;

  // Component scores
  const foundation = foundationScores[foundationType] ?? 0;
  const elevation = elevationScore(netElevation);
  const materialInfo = materialLibrary[material] ?? { score: 0 };
  const materialScore = materialInfo.score;

  const mitigation = features.reduce((sum, key) => {
    const feature = mitigationFeatures[key];
    return sum + (feature?.score ?? 0);
  }, 0);

  const rawScore = foundation + elevation + materialScore + mitigation;
  const resilienceScore = Math.min(rawScore, 100);

  // Flood Year Cutoff
  const cutoffYear = estimateCutoffYear(elevationFt, seaLevels, bfeData.bfeFt);

  return {
    resilienceScore,
    cutoffYear,
    breakdown: {
      foundation,
      elevation,
      material: materialScore,
      mitigation,
    },
  };
}

function estimateCutoffYear(
  buildingElevationFt: number,
  seaLevelScenario: Record<string, number>,
  bfeFt: number,
): number {
  const totalElevation = buildingElevationFt;
  for (const [yearStr, projectedSeaRise] of Object.entries(seaLevelScenario)) {
    const projectedWaterLevel = bfeFt + projectedSeaRise;
    if (totalElevation < projectedWaterLevel) {
      return parseInt(yearStr, 10);
    }
  }
  return 2060;
}