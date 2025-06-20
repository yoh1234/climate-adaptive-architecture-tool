// domain/seaLevelScenarios.ts

/**
 * Sea level rise projections for Grand Isle, LA
 * Based on NOAA worst-case projections (in feet)
 * Uncertainty modeled using 0.3–2.0m scenarios, LOW/MED/HIGH percentiles
 */

export const seaLevelRiseScenarios: Record<string, Record<string, number>> = {
  '1.0 - LOW': {
    2020: 0.52, 2030: 0.89, 2040: 1.31, 2050: 1.74, 2060: 2.23,
  },
  '1.0 - MED': {
    2020: 0.59, 2030: 1.02, 2040: 1.48, 2050: 1.97, 2060: 2.53,
  },
  '1.0 - HIGH': {
    2020: 0.69, 2030: 1.15, 2040: 1.71, 2050: 2.26, 2060: 2.85,
  },
  // More scenarios can be added as needed
};
