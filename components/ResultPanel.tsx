/**
 * ResultPanel.tsx — Displays the output of a building resilience simulation.
 *
 * This component receives a SimulationResult and renders:
 * - The overall resilience score (0–100)
 * - A year-by-year flood risk performance timeline (2025–2055)
 * - AI-generated design recommendations
 * - Cost-benefit analysis summary
 *
 * Props:
 * - result: SimulationResult
 *     Contains the full simulation output returned from the backend
 *
 * Used in:
 * - pages/index.tsx (after simulation is submitted)
 *
 * Style:
 * - Uses Tailwind CSS for layout and theming
 * - Dynamically adjusts background color based on risk status
 *
 * Notes:
 * - `performanceTimeline` is a list of { year, status }, where status ∈ ['ok', 'warning', 'fail']
 * - AI recommendations are rendered as a bullet list
 */

import { SimulationResult } from '@/domain/types';

interface ResultsPanelProps {
  result: SimulationResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const { resilienceScore, cutoffYear, materialRiskScore, recommendation, costBenefitAnalysis, breakdown } = result;

  return (
    <div className="space-y-6 mt-8 p-6 border rounded bg-gray-50 shadow-md">
      {/* Score Summary */}
      <section>
        <h2 className="text-lg font-bold text-gray-800">🏗️ Resilience Score</h2>
        <div className="text-4xl font-extrabold text-blue-600 mt-1">{resilienceScore} / 100</div>
        <p className="text-sm text-gray-600 mt-1">
          This building is projected to withstand flooding through <strong>{cutoffYear}</strong> under the selected climate scenario.
        </p>
      </section>

      {/* Score Breakdown */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mt-4">🔍 Score Breakdown</h2>
        <ul className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
          <li>• Foundation: {breakdown.foundation}</li>
          <li>• Elevation: {breakdown.elevation}</li>
          <li>• Material: {breakdown.material}</li>
          <li>• Mitigation: {breakdown.mitigation}</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          Material Risk Score (durability indicator): {materialRiskScore} / 30
        </p>
      </section>

      {/* AI Recommendation */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mt-4">💡 AI Recommendation</h2>
        <p className="text-gray-700">{recommendation}</p>
      </section>

      {/* Cost-Benefit */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mt-4">📈 Cost-Benefit Summary</h2>
        <p className="text-gray-700">{costBenefitAnalysis}</p>
      </section>
    </div>
  );
}
