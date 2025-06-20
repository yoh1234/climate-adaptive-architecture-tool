// scores.ts — Static scoring configuration used in simulation
// These scores quantify the contribution of each input parameter to flood resilience

import { BuildingInput } from './types';

/**
 * foundationScores assigns a resilience score to each foundation type.
 *
 * These scores reflect relative flood protection based on elevation potential
 * and structural behavior under flood conditions.
 *
 * Score Range:
 * - slab (low elevation, high risk): 10
 * - pier (moderate elevation, open structure): 20
 * - elevated (elevated platform, optimal): 30
 *
 * Used by:
 * - `calculateScore` in services/scoring.ts
 * - Optionally rendered in prompt or UI for LLM context
 */
export const foundationScores: Record<BuildingInput['foundationType'], number> = {
  slab: 10,
  pier: 20,
  elevated: 30,
};