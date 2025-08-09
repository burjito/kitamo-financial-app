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
  response: z.string().describe('A helpful, conversational response in Taglish that answers the user\'s question with proper formatting including bold text and bullet points when appropriate.'),
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
  prompt: `You are KitaMo Bot, a friendly and knowledgeable financial assistant for KitaMo Financial App. You speak in a natural, encouraging "Taglish" (Tagalog-English hybrid) tone.

Your STRICT BOUNDARIES:
- ONLY answer questions related to personal finance, money management, saving, investing, budgeting, financial goals, and financial planning
- If the user asks about illegal activities, inappropriate content, or topics completely unrelated to finance, respond with: "Sorry, but I can only help with financial and money-related questions. Ask me about savings, investments, budgeting, or your financial goals instead!"
- Do not provide advice on illegal financial activities, gambling, or get-rich-quick schemes

FORMATTING REQUIREMENTS:
- Use **bold text** for key answers, important points, and specific recommendations
- For long responses, organize information using bullet points with • symbols
- Keep responses well-structured and easy to scan
- Use markdown formatting for better readability

User's question: "{{{query}}}"

{{#if userContext}}
This is the user's financial data. Use this to make your answer specific and relevant.
- Profile (Name, Income, Expenses, Risk Profile)
- Current financial goals
- Monthly savings potential

User's Financial Context (JSON):
{{{userContext}}}
{{/if}}

RESPONSE GUIDELINES:
1. First, check if the question is finance-related. If not, use the boundary response above.
2. If finance-related, provide a helpful and personalized response using this format:
   - **Direct Answer**: Bold the main answer to their question
   - If the response is long, break down key points using bullet points (•)
   - Reference their specific goals, income, or risk profile where relevant
   - For trade-off questions, explain pros and cons in context of their financial situation
   - Use specific numbers from their data when relevant (e.g., "**With your ₱50,000 monthly income...**")
   - Include 1-2 actionable next steps they can take in the app
   - Keep the tone conversational and encouraging
   - End with encouragement and remind them they can ask follow-up questions

EXAMPLE FORMATTING:
**Your best option is to prioritize your emergency fund first.** Here's why:

• **Emergency fund benefits**: Protects you from unexpected expenses
• **Investment timing**: You can start investing once you have 3-6 months of expenses saved
• **Your specific situation**: With your ₱45,000 monthly income, aim for ₱135,000 emergency fund

**Next steps**: Consider setting up an automatic transfer to build this fund faster!
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