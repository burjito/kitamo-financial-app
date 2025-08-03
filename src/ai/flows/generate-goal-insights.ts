
'use server';

/**
 * @fileOverview An AI flow for generating insights on a user's overall goal plan.
 *
 * - generateGoalInsights - A function that generates insights based on all of a user's goals.
 * - GenerateGoalInsightsInput - The input type for the generateGoalInsights function.
 * - GenerateGoalInsightsOutput - The return type for the generateGoalInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Goal } from '@/contexts/app-context';

const GoalSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  target: z.number(),
  current: z.number(),
  status: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  monthlyTarget: z.number(),
});

const GenerateGoalInsightsInputSchema = z.object({
  monthlyIncome: z.number().describe("The user's total monthly income."),
  goals: z.array(GoalSchema).describe("A list of the user's financial goals."),
});
export type GenerateGoalInsightsInput = z.infer<typeof GenerateGoalInsightsInputSchema>;

const GenerateGoalInsightsOutputSchema = z.object({
  insight: z
    .string()
    .describe(
      'A concise, actionable insight based on the user\'s overall financial goal structure. This should be 1-2 sentences.'
    ),
  feasibilityScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0-100 indicating the overall feasibility of the user\'s current goal plan. 100 is highly feasible, 0 is not feasible.'
    ),
});
export type GenerateGoalInsightsOutput = z.infer<typeof GenerateGoalInsightsOutputSchema>;


export async function generateGoalInsights(input: GenerateGoalInsightsInput): Promise<GenerateGoalInsightsOutput> {
  return generateGoalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoalInsightsPrompt',
  input: {schema: GenerateGoalInsightsInputSchema},
  output: {schema: GenerateGoalInsightsOutputSchema},
  prompt: `You are a helpful financial advisor AI for BPI's KitaMo app. Your task is to analyze a user's complete financial goal plan and provide a concise, actionable insight and a feasibility score.

User's Financial Data:
- Monthly Income: ₱{{{monthlyIncome}}}
- Financial Goals:
{{#each goals}}
  - Goal: {{title}}
    Target: ₱{{target}}
    Current Savings: ₱{{current}}
    Monthly Contribution: ₱{{monthlyTarget}}
    Priority: {{priority}}
{{/each}}

Analysis Steps:
1.  **Calculate Total Monthly Goal Contribution**: Sum the 'monthlyTarget' for all goals.
2.  **Calculate Savings Surplus/Shortfall**: Subtract the total monthly goal contribution from the 'monthlyIncome'.
3.  **Assess Feasibility**:
    - A large surplus is very feasible (score > 80).
    - A small surplus is feasible (score 60-80).
    - A small shortfall means the plan is challenging (score 40-60).
    - A large shortfall means the plan is not feasible (score < 40).
    - Consider the priority. If a high-priority goal is underfunded, the feasibility is lower.
    - If total contributions are zero or very low compared to income, the feasibility of achieving goals is low (score < 50), even if there's a surplus.
4.  **Generate Insight**: Based on your analysis, provide a single, actionable piece of advice.
    - If there's a healthy surplus, suggest accelerating a high-priority goal.
    - If there's a shortfall, suggest reviewing low-priority goals or finding ways to increase income/reduce expenses.
    - If contributions are too low, encourage the user to allocate more to their goals.
    - Keep the insight to 1-2 sentences.

**Example Output:**
{
  "insight": "Your plan is on track, but you could reach your 'Emergency Fund' goal 5 months sooner by allocating your monthly surplus of ₱5,000 towards it.",
  "feasibilityScore": 85
}

Generate the insight and feasibility score for the provided user data.
`,
});

const generateGoalInsightsFlow = ai.defineFlow(
  {
    name: 'generateGoalInsightsFlow',
    inputSchema: GenerateGoalInsightsInputSchema,
    outputSchema: GenerateGoalInsightsOutputSchema,
  },
  async input => {
    // If there are no goals, return a default state.
    if (input.goals.length === 0) {
      return {
        insight: "You haven't added any goals yet. Add a goal to get started and see your financial plan come to life!",
        feasibilityScore: 0,
      }
    }

    const {output} = await prompt(input);
    return output!;
  }
);
