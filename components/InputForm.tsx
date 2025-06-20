/**
 * InputForm.tsx — A user input form for entering building design parameters.
 *
 * This component:
 * - Renders input controls for foundation type, elevation, materials, flood features, and neighborhood
 * - Maintains internal form state based on the BuildingInput interface
 * - Calls `onSubmit` with structured input when the user submits the form
 * - Shows a loading indicator during asynchronous operations
 *
 * Props:
 * - onSubmit: (input: BuildingInput) => void
 *     Callback function called when form is submitted
 * - isLoading: boolean (optional)
 *     Disables the button and changes text to "Simulating..." while request is in progress
 *
 * State:
 * - form: BuildingInput
 *     Internal representation of the current form values
 *
 * Related Types:
 * - BuildingInput: defined in domain/types.ts
 *     Includes foundationType, elevationFt, material, mitigationFeatures, neighborhood
 *
 * Notes:
 * - Uses Tailwind classes for basic layout and responsiveness
 * - Foundation and Material values are single-select; Features are multi-select
 */

import { useState } from 'react';
import { BuildingInput, FoundationType, MaterialType, MitigationFeature } from '@/domain/types';

interface InputFormProps {
  onSubmit: (input: BuildingInput) => void;
  isLoading?: boolean;
}

const foundations: FoundationType[] = ['slab', 'pier', 'elevated'];
const materials: MaterialType[] = ['wood', 'concrete', 'metal'];
const mitigationFeatures: MitigationFeature[] = ['floodVents', 'breakawayWalls', 'sumpPump'];
const neighborhoods = ['Bywater', 'MidCity', 'Lakeview', 'FrenchQuarter', 'Lower9thWard'];

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [form, setForm] = useState<BuildingInput>({
    foundationType: 'slab',
    elevationFt: 5,
    material: 'wood',
    mitigationFeatures: [],
    neighborhood: 'Bywater',
  });

  const handleChange = <K extends keyof BuildingInput>(field: K, value: BuildingInput[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: MitigationFeature) => {
    setForm(prev => {
      const current = prev.mitigationFeatures;
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      return { ...prev, mitigationFeatures: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border rounded p-6 bg-white shadow-md">
      {/* Neighborhood */}
      <div>
        <label className="block font-semibold">Neighborhood</label>
        <select
          value={form.neighborhood}
          onChange={e => handleChange('neighborhood', e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          {neighborhoods.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Foundation */}
      <div>
        <label className="block font-semibold">Foundation Type</label>
        <select
          value={form.foundationType}
          onChange={e => handleChange('foundationType', e.target.value as FoundationType)}
          className="w-full border px-2 py-1 rounded"
        >
          {foundations.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Elevation */}
      <div>
        <label className="block font-semibold">Elevation (feet)</label>
        <input
          type="number"
          min={0}
          step={0.1}
          value={form.elevationFt}
          onChange={e => handleChange('elevationFt', parseFloat(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Material */}
      <div>
        <label className="block font-semibold">Primary Material</label>
        <div className="flex flex-wrap gap-4 mt-1">
          {materials.map(m => (
            <label key={m} className="flex items-center gap-2">
              <input
                type="radio"
                name="material"
                value={m}
                checked={form.material === m}
                onChange={() => handleChange('material', m)}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Mitigation Features */}
      <div>
        <label className="block font-semibold">Flood Mitigation Features</label>
        <div className="flex flex-wrap gap-4 mt-1">
          {mitigationFeatures.map(f => (
            <label key={f} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.mitigationFeatures.includes(f)}
                onChange={() => toggleFeature(f)}
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Simulating...' : 'Run Simulation'}
      </button>
    </form>
  );
}
