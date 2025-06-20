// pages/index.tsx
/**
 * Main page — collects user building input and displays flood resilience simulation result.
 * Handles loading and error states, connects with API, and renders LLM analysis.
 */

import { useState } from 'react';
import Head from 'next/head';
import InputForm from '@/components/InputForm';
import ResultsPanel from '@/components/ResultPanel';
import { BuildingInput, SimulationResult } from '@/domain/types';


export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: BuildingInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unexpected error');
      }

      const data: SimulationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('[Simulation error]', err);
      setError(err.message || 'Failed to simulate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Climate-Adaptive Architecture Tool</title>
        <meta name="description" content="Simulate flood resilience of building designs in New Orleans" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Flood Resilience Simulator</h1>

        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="mt-6 text-red-600 border border-red-300 bg-red-50 p-4 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && <ResultsPanel result={result} />}
      </main>
    </>
  );
}
