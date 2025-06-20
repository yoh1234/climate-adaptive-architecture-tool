/**
 * llmPrompt.ts — Generates a complete natural language prompt for the LLM to interpret.
 *
 * The generated prompt includes:
 * - Raw building input (elevation, materials, foundation, mitigation features)
 * - Simulation result summary (score, cutoff year, score breakdown)
 * - Extreme flood scenario summary (max sea level rise + BFE)
 * - Cost and durability mock context for materials and mitigation options
 * - A strict instruction format to produce both:
 *     1. A design recommendation
 *     2. A cost-benefit analysis
 *
 * Inputs:
 * - BuildingInput: user-submitted building configuration
 * - SimulationResult: result from calculateScore including resilience score, cutoff year, breakdown
 *
 * Output:
 * - A single formatted prompt string to be sent to the LLM
 *
 * Notes:
 * - Automatically generates dynamic context from the domain layer (e.g., materials, scores)
 * - Uses a plain format with markdown-friendly structure for easier parsing
 * - Designed for OpenAI's gpt-4 model in callLLM()
 */

import { BuildingInput, SimulationResult } from '@/domain/types';
import { materialLibrary } from '@/domain/materials';
import { mitigationFeatures } from '@/domain/mitigationFeatures';
import { bfeByNeighborhood } from '@/domain/bfeByNeighborhood';
import { foundationScores } from '@/domain/foundationScores';
import { seaLevelRiseScenarios } from '@/domain/seaLevelScenarios'

export function generateLLMPrompt(input: BuildingInput, result: SimulationResult): string {
  const { foundationType, elevationFt, material, mitigationFeatures: features, neighborhood } = input;
  const { resilienceScore, cutoffYear, breakdown } = result;

  const bfe = bfeByNeighborhood[neighborhood];
  const materialDesc = materialLibrary[material]?.description ?? '';
  const mitigationDescriptions = features
    .map((f) => `- ${f}: ${mitigationFeatures[f]?.description ?? 'N/A'}`)
    .join('\n');
  
  // Design Options

  const materialOptions = Object.entries(materialLibrary)
  .map(([name, info]) => `- ${name}: ${info.description}`)
  .join('\n');

  const mitigationOptions = Object.entries(mitigationFeatures)
    .map(([name, info]) => `- ${name}: ${info.description}`)
    .join('\n');

  const foundationOptions = Object.entries(foundationScores)
    .map(([name, score]) => `- ${name} (score: ${score})`)
    .join('\n');

  const maxFloodLine = (() => {
    const worst = seaLevelRiseScenarios['1.0 - HIGH'];
    const maxSeaLevel = Math.max(...Object.values(worst));
    const maxBFE = Math.max(...Object.values(bfeByNeighborhood).map(n => n.bfeFt));
    return (maxSeaLevel + maxBFE).toFixed(2);
  })();

  return `
You are an expert flood resilience design advisor.
design buildings that will perform well as conditions change over the next 30 years.
Your job is to analyze the building design and simulation below, and provide:

1. A short, actionable recommendation for improving resilience
2. A thoughtful cost-benefit analysis of the current design vs. possible improvements

--- DESIGN INPUT ---
• Neighborhood: ${neighborhood}
• Base Flood Elevation (BFE): ${bfe.bfeFt} ft ±${bfe.uncertaintyFt} ft
• Foundation Type: ${foundationType}
• Elevation: ${elevationFt} ft
• Material: ${material} — ${materialDesc}
• Mitigation Features:
${mitigationDescriptions}

--- SIMULATION OUTPUT ---
• Resilience Score: ${resilienceScore}/100
• Projected Safe Until: ${cutoffYear}
• Score Breakdown:
  - Foundation: ${breakdown.foundation}
  - Elevation: ${breakdown.elevation}
  - Material: ${breakdown.material}
  - Mitigation: ${breakdown.mitigation}

  ---
[Design Recommendation Option]  
• Foundation Types:
${foundationOptions}

• Materials:
${materialOptions}

• Flood Mitigation Features:
${mitigationOptions}

[Extreme Flood Scenario]
• Max projected flood level (BFE + sea level rise): ${maxFloodLine} ft (based on "1.0 - HIGH")

  ---  
[COST & DURABILITY CONTEXT]
• Foundation Types:
  - Slab: ~$6,000, low flood resistance, ~20 yrs durability
  - Pier: ~$9,000, moderate flood resistance, ~25 yrs durability
  - Elevated: ~$14,000, high flood resistance, ~30+ yrs durability

• Materials:
  - Wood: low durability (~10 yrs), high flood damage risk (~$15K repair avg)
  - Concrete: high durability (~30 yrs), low damage risk (~$5K repair avg)

• Mitigation Features:
  - Flood vents: ~$1,200 (high effectiveness)
  - Breakaway walls: ~$3,500 (medium)
  - Sump pump: ~$900 (medium)

• Elevation Improvements:
    +0 ft → ~$0
  - +2 ft → ~$8,000
  - +4 ft → ~$14,000
  - +6 ft → ~$20,000
  - +8 ft → ~$25,000
  - +10 ft → ~$30,000

---

Please respond in this format:

1. Design Recommendation:
  --- 
Consider available options, design input and output, and uncertainty (worst case flood scenario).
Be specific about how much elevation is needed to withstand future floods.
If the design already achieves a great resilience score close to 100 and withstands flood projections through 2060, avoid recommending major changes and try to minimize the additional cost.
  --- 
<one paragraph>

2. Cost-Benefit Analysis:
  --- 
Consider how to acheive reasonable resilience score while minimizing the potential design cost.
  --- 
<one paragraph>

`;
}
