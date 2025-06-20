/**
 * Calculates the elevation score for a building design.
 *
 * This function assigns a score based on how elevated the structure is (in feet)
 * relative to sea level or BFE. Higher elevation generally correlates with greater
 * flood resilience. The score is one component of the overall resilience score.
 *
 * Scoring tiers:
 * - 10 ft or higher → 30 points
 * - 6–9.9 ft        → 20 points
 * - 3–5.9 ft        → 10 points
 * - Below 3 ft      → 0 points
 *
 * @param elevationFt - Total elevation of the building above sea level (or base reference)
 * @returns A numeric score between 0 and 30
 */
// Elevation contribution (in feet)

export const elevationScore = (elevationFt: number): number => {
  if (elevationFt >= 10) return 30;
  if (elevationFt >= 6) return 20;
  if (elevationFt >= 3) return 10;
  return 0;
};
