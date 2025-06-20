/**
 * simulate.ts — High-level orchestrator that runs a full design simulation pipeline.
 *
 * This service function coordinates:
 * 1. Score computation via `calculateScore` (resilienceScore, cutoffYear, breakdown)
 * 2. Prompt generation using `generateLLMPrompt` (with context + instructions)
 * 3. LLM call via `callLLM` (returns recommendation and cost-benefit text)
 *
 * Inputs:
 * - BuildingInput: user-selected building design parameters
 *
 * Output:
 * - SimulationResult: the complete output object with:
 *     - resilienceScore
 *     - cutoffYear
 *     - materialRiskScore
 *     - recommendation
 *     - costBenefitAnalysis
 *     - breakdown
 *
 * Notes:
 * - This is the main entry point used by the /api/simulate endpoint
 * - Keeps infrastructure concerns (e.g., LLM call, scoring) loosely coupled
 * - Easy to mock/test in isolation
 */

import { BuildingInput, SimulationResult } from '@/domain/types';
import { calculateScore } from './scoring';
import { generateLLMPrompt } from './llmPrompt';
import { materialLibrary } from '@/domain/materials';
import { callLLM } from './llmClient';

export async function simulateBuilding(input: BuildingInput): Promise<SimulationResult> {
  // Score calculation
  const scoreResult = calculateScore(input);

  // Step 2: Lookup material score (used as proxy for long-term durability)
  const materialScore = materialLibrary[input.material]?.score ?? 0;

  // Step 3: Generate LLM prompt with full context
  const prompt = generateLLMPrompt(input, {
    ...scoreResult,
    materialRiskScore: materialScore,
    recommendation: '',
    costBenefitAnalysis: '',
  });
  console.log(prompt);
  // Step 4: Query LLM for adaptive recommendation and cost-benefit analysis
  const { recommendation, costBenefitAnalysis } = await callLLM(prompt);

  // Final assembled result
  return {
    ...scoreResult,
    materialRiskScore: materialScore,
    recommendation,
    costBenefitAnalysis,
  };
}
