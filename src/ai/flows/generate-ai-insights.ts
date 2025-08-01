'use server';

/**
 * @fileOverview A flow for generating AI insights based on a financial scenario.
 *
 * - generateAiInsights - A function that generates AI insights for a financial scenario.
 * - GenerateAiInsightsInput - The input type for the generateAiInsights function.
 * - GenerateAiInsightsOutput - The return type for the generateAiInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiInsightsInputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A description of the financial scenario the user simulated.'),
  projectedSurplusOrShortfall: z
    .number()
    .describe(
      'The projected surplus or shortfall in the financial scenario.  Negative numbers indicate a shortfall, positive numbers indicate a surplus.'
    ),
  monthlySavings: z
    .number()
    .describe('The users current monthly savings in the scenario.'),
  timelineMonths: z
    .number()
    .describe('The timeline for the goal in months'),
});
export type GenerateAiInsightsInput = z.infer<typeof GenerateAiInsightsInputSchema>;

const GenerateAiInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'AI-generated insights and suggestions to improve the financial plan, such as increasing monthly savings or extending the timeline.'
    ),
});
export type GenerateAiInsightsOutput = z.infer<typeof GenerateAiInsightsOutputSchema>;

export async function generateAiInsights(input: GenerateAiInsightsInput): Promise<GenerateAiInsightsOutput> {
  return generateAiInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiInsightsPrompt',
  input: {schema: GenerateAiInsightsInputSchema},
  output: {schema: GenerateAiInsightsOutputSchema},
  prompt: `You are a financial advisor providing advice to BPI bank users.

  Based on the financial scenario described below, provide clear, explainable suggestions and insights to the user.

  Scenario Description: {{{scenarioDescription}}}
  Projected Surplus or Shortfall: {{{projectedSurplusOrShortfall}}}
  Monthly Savings: {{{monthlySavings}}}
  Timeline (months): {{{timelineMonths}}}

  Give advice to the user in order to reach their goals, such as increasing monthly savings or extending the timeline.
`,
});

const generateAiInsightsFlow = ai.defineFlow(
  {
    name: 'generateAiInsightsFlow',
    inputSchema: GenerateAiInsightsInputSchema,
    outputSchema: GenerateAiInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
