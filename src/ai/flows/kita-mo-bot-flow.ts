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
  userContext: z.string().optional().describe('JSON string of user data like goals, income, etc.'),
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

Your goal is to help users understand their financial situation and make better decisions. You are conversational, empathetic, and break down complex topics into simple terms.

User's question: "{{{query}}}"

{{#if userContext}}
Here is some information about the user you can use to personalize your answer. Don't mention you have this data, just use it to inform your response.
User's Financial Context:
{{{userContext}}}
{{/if}}

Based on the user's question and their context (if available), provide a helpful response.
- Answer the user's question directly and clearly.
- If it's a trade-off question (e.g., invest vs. pay debt), explain the pros and cons of each in a simple way.
- Always be encouraging and positive.
- Suggest one or two "next best actions" the user could take, like running a simulation in the app or setting a new goal.
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
