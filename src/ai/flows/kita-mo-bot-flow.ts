
'use server';

/**
 * @fileOverview A conversational AI assistant for financial planning.
 *
 * - kitaMoBot - A function that handles conversational financial queries.
 * - KitaMoBotInput - The input type for the kitaMoBot function.
 * - KitaMoBotOutput - The return type for the kitaMoBot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const KitaMoBotInputSchema = z.object({
  query: z.string().describe('The user\'s financial question in English or Taglish.'),
  userContext: z.string().optional().describe('A JSON string containing the user\'s financial data, including profile (name, income, expenses, risk profile) and a list of their current goals.'),
});
export type KitaMoBotInput = z.infer<typeof KitaMoBotInputSchema>;

const KitaMoBotOutputSchema = z.object({
  response: z.string().describe('A helpful, conversational response in Taglish that answers the user\'s question.'),
  nextBestActions: z.array(z.string()).optional().describe('Suggested next actions for the user, like "Run a simulation" or "Create a new goal".'),
});
export type KitaMoBotOutput = z.infer<typeof KitaMoBotOutputSchema>;

export async function kitaMoBot(input: KitaMoBotInput): Promise<KitaMoBotOutput> {
  return kitaMoBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'kitaMoBotPrompt',
  input: { schema: KitaMoBotInputSchema },
  output: { schema: KitaMoBotOutputSchema },
  prompt: `You are KitaMo Bot, a friendly and knowledgeable financial assistant for BPI. You speak in a natural, encouraging "Taglish" (Tagalog-English hybrid) tone.

Your goal is to provide hyper-personalized financial advice. You must use the user's financial context to inform every response.

User's question: "{{{query}}}"

{{#if userContext}}
This is the user's financial data. Use this to make your answer specific and relevant.
- Profile (Name, Income, Expenses, Risk Profile)
- Current financial goals
- Monthly savings potential

User's Financial Context (JSON):
{{{userContext}}}
{{/if}}

Based on the user's question and their provided financial context, provide a helpful and personalized response.
- Answer the user's question directly, referencing their specific goals, income, or risk profile where relevant.
- If it's a trade-off question (e.g., invest vs. pay debt), explain the pros and cons in the context of *their* risk profile and goals.
- Always be encouraging and positive.
- Suggest one or two "next best actions" the user could take in the app that are relevant to their situation.
- Keep your response conversational, like talking to a friend.
`,
});

const kitaMoBotFlow = ai.defineFlow(
  {
    name: 'kitaMoBotFlow',
    inputSchema: KitaMoBotInputSchema,
    outputSchema: KitaMoBotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
