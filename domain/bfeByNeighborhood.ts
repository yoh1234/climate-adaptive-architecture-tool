// domain/bfeByNeighborhood.ts

/**
 * Base Flood Elevation (BFE) by neighborhood in New Orleans.
 * Sourced from FEMA flood maps and hydrologic modeling references.
 * Includes an uncertainty band of ±0.5 ft to account for mapping/modeling variability.
 *
 * This data is used to assess whether a building's proposed elevation
 * exceeds minimum safety thresholds under future flood risk scenarios.
 */

export const bfeByNeighborhood: Record<string, { bfeFt: number; uncertaintyFt: number }> = {
  Bywater: {
    bfeFt: 6.0,
    uncertaintyFt: 0.5,
  },
  MidCity: {
    bfeFt: 5.5,
    uncertaintyFt: 0.5,
  },
  Lakeview: {
    bfeFt: 7.0,
    uncertaintyFt: 0.5,
  },
  FrenchQuarter: {
    bfeFt: 4.0,
    uncertaintyFt: 0.5,
  },
  Lower9thWard: {
    bfeFt: 8.0,
    uncertaintyFt: 0.5,
  },
};
