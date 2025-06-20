/**
 * FeatureInfo represents a flood mitigation feature’s effectiveness and score impact.
 *
 * Each feature includes:
 * - `score`: Numeric contribution to overall resilience score (0–20 typical range)
 * - `effectiveness`: Qualitative label used for display and LLM prompt generation
 * - `description`: Human-readable explanation for LLMs and tooltips
 */
export interface FeatureInfo {
  score: number;
  effectiveness: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * mitigationFeatures defines available flood mitigation features and their impact.
 *
 * Used by:
 * - Scoring engine (`calculateScore`)
 * - Input form UI (checkbox list)
 * - LLM prompt construction (`generateLLMPrompt`)
 */
export const mitigationFeatures: Record<string, FeatureInfo> = {
  floodVents: {
    score: 12,
    effectiveness: 'high',
    description: 'Allows water to pass through foundation to relieve pressure.',
  },
  breakawayWalls: {
    score: 10,
    effectiveness: 'medium',
    description: 'Walls that collapse under pressure to protect main structure.',
  },
  sumpPump: {
    score: 8,
    effectiveness: 'medium',
    description: 'Removes water from basements or crawl spaces.',
  },
};