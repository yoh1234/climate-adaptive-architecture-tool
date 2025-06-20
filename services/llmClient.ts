/**
 * llmClient.ts — OpenAI API wrapper for calling the LLM and parsing its output.
 *
 * This module:
 * - Initializes the OpenAI client with environment-provided API key
 * - Sends a structured system + user prompt message using gpt-4
 * - Parses the result into two parts:
 *     1. Design Recommendation (paragraph)
 *     2. Cost-Benefit Analysis (paragraph)
 * - Handles error cases gracefully with fallback messages
 *
 * Inputs:
 * - prompt: Full user-facing prompt string (from llmPrompt.ts)
 *
 * Output:
 * - { recommendation, costBenefitAnalysis }: Parsed object from LLM response
 *
 * Notes:
 * - Assumes prompt uses a "1. Design Recommendation\n2. Cost-Benefit Analysis" format
 * - May be extended with retry, streaming, or rate-limit logic later
 */

import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000,
});

export async function callLLM(prompt: string): Promise<{
  recommendation: string;
  costBenefitAnalysis: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 1.0,
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful architectural advisor focused on climate resilience. Respond clearly and concisely.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const output = response.choices[0]?.message?.content || '';

    const [recommendation, costBenefitAnalysis] = output
      .split(/(?:^|\n)2\./) // splits at "2."
      .map((s) => s.trim().replace(/^1\./, '').trim());

    return {
      recommendation: recommendation || 'No recommendation provided.',
      costBenefitAnalysis: costBenefitAnalysis || 'No cost-benefit analysis provided.',
    };
  } catch (error) {
    console.error('LLM call failed:', error);
    return {
      recommendation: 'Unable to generate recommendation at this time.',
      costBenefitAnalysis: 'Unable to perform cost-benefit analysis due to an error.',
    };
  }
}