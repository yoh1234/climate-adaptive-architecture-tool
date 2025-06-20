/**
 * MaterialInfo represents the flood resilience properties of a construction material.
 *
 * Each material has:
 * - `score`: Numeric contribution to the overall resilience score (0–30 scale)
 * - `durability`: Qualitative durability indicator used in LLM reasoning
 * - `description`: Short explanation for use in user-facing summaries and AI prompts
 */

export interface MaterialInfo {
  score: number;
  durability: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * materialLibrary defines the resilience characteristics of each material option.
 *
 * Used by:
 * - Resilience score calculator (`calculateScore`)
 * - LLM prompt generator (`generateLLMPrompt`)
 * - Frontend material picker (InputForm)
 */

export const materialLibrary: Record<string, MaterialInfo> = {
  wood: {
    score: 10,
    durability: 'low',
    description: 'Wood is prone to water damage, rot, and mold.',
  },
  metal: {
    score: 15,
    durability: 'medium',
    description: 'Metal resists flooding but may corrode.',
  },
  concrete: {
    score: 25,
    durability: 'high',
    description: 'Concrete is highly resistant to flooding.',
  },
  composite: {
    score: 28,
    durability: 'high',
    description: 'Composite materials offer strong flood resilience.',
  },
};
