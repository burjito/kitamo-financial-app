'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized financial forecasts based on user inputs.
 *
 * - generateFinancialForecast - A function that takes user inputs and returns a financial forecast.
 * - FinancialForecastInput - The input type for the generateFinancialForecast function.
 * - FinancialForecastOutput - The return type for the generateFinancialForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialForecastInputSchema = z.object({
  income: z.number().describe('Your monthly income.'),
  expenses: z.number().describe('Your monthly expenses.'),
  financialGoals: z
    .string()
    .describe(
      'A description of your financial goals, including the desired amount and timeline.'
    ),
});
export type FinancialForecastInput = z.infer<typeof FinancialForecastInputSchema>;

const FinancialForecastOutputSchema = z.object({
  forecast: z.string().describe('A personalized financial forecast.'),
  suggestedSavings: z
    .number()
    .describe('The suggested monthly savings amount to achieve your goals.'),
  timeline: z.string().describe('The estimated timeline to achieve your goals.'),
});
export type FinancialForecastOutput = z.infer<typeof FinancialForecastOutputSchema>;

export async function generateFinancialForecast(
  input: FinancialForecastInput
): Promise<FinancialForecastOutput> {
  return generateFinancialForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialForecastPrompt',
  input: {schema: FinancialForecastInputSchema},
  output: {schema: FinancialForecastOutputSchema},
  prompt: `You are a financial advisor. Analyze the user's income, expenses, and financial goals to generate a personalized financial forecast.

Income: {{income}}
Expenses: {{expenses}}
Financial Goals: {{financialGoals}}

Based on this information, provide a forecast that includes:
- A summary of the user's financial situation.
- How much the user needs to save each month to achieve their goals.
- An estimated timeline for achieving those goals.
`,
});

const generateFinancialForecastFlow = ai.defineFlow(
  {
    name: 'generateFinancialForecastFlow',
    inputSchema: FinancialForecastInputSchema,
    outputSchema: FinancialForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
