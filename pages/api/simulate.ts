/**
 * /api/simulate — HTTP POST endpoint to run a building flood resilience simulation.
 *
 * Accepts a JSON payload describing building design parameters, validates the input,
 * runs the full simulation pipeline, and returns a structured SimulationResult object.
 *
 * Method: POST
 *
 * Request Body (BuildingInput):
 * - foundationType: string ('slab' | 'pier' | 'elevated')
 * - elevationFt: number (building elevation in feet)
 * - material: string ('wood' | 'concrete' | 'metal' | 'composite')
 * - mitigationFeatures: string[] (list of selected mitigation features)
 * - neighborhood: string (e.g., 'Bywater', 'Lakeview', etc.)
 *
 * Response: 200 OK
 * - SimulationResult:
 *     - resilienceScore
 *     - cutoffYear
 *     - materialRiskScore
 *     - recommendation
 *     - costBenefitAnalysis
 *     - breakdown (foundation/elevation/material/mitigation)
 *
 * Error Responses:
 * - 405: Method Not Allowed (non-POST requests)
 * - 400: Invalid input structure
 * - 500: Simulation failure due to internal error
 *
 * Used by:
 * - pages/index.tsx (Home page)
 * - Triggered via fetch on form submit in <InputForm />
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { BuildingInput, SimulationResult } from '@/domain/types';
import { simulateBuilding } from '@/services/simulate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulationResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const input = req.body as Partial<BuildingInput>;

    // Basic type checks — in production you'd replace this with zod/io-ts validation
    if (
      typeof input.foundationType !== 'string' ||
      typeof input.elevationFt !== 'number' ||
      typeof input.material !== 'string' ||
      !Array.isArray(input.mitigationFeatures) ||
      typeof input.neighborhood !== 'string'
    ) {
      return res.status(400).json({ error: 'Invalid input format. Please check required fields.' });
    }

    const result = await simulateBuilding(input as BuildingInput);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[simulate API error]', err);
    return res.status(500).json({ error: 'Simulation failed due to server error.' });
  }
}