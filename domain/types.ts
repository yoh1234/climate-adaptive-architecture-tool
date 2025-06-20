// types.ts — Core type definitions for building simulation
// Shared between frontend and backend

export type FoundationType = 'slab' | 'pier' | 'elevated';
export type MaterialType = 'wood' | 'concrete' | 'metal';
export type MitigationFeature = 'floodVents' | 'breakawayWalls' | 'sumpPump';

export interface BuildingInput {
  foundationType: FoundationType;
  elevationFt: number;
  material: MaterialType;
  mitigationFeatures: MitigationFeature[];
  neighborhood: string;
}

export interface SimulationResult {
  resilienceScore: number; // Overall structural resilience score (0–100)
  cutoffYear: number; // Last year the building is projected to withstand flood levels
  materialRiskScore: number; // Score representing long-term material vulnerability (higher = better)
  recommendation: string; // AI-generated recommendation text
  costBenefitAnalysis: string; // AI-generated cost-benefit summary
  breakdown: ScoreBreakdown;
}
export interface ScoreBreakdown {
  foundation: number;
  elevation: number;
  material: number;
  mitigation: number;
}