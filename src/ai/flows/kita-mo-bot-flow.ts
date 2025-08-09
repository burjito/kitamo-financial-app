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

FORMATTING REQUIREMENTS (VERY IMPORTANT):
- Use **bold text** for key answers, important points, and specific recommendations
- For multiple points, use bullet lists with • symbol
- Keep responses well-structured and easy to scan
- Use proper markdown formatting - your response will be rendered as markdown

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
   
   **[Direct answer to their question in bold]**
   
   If you need to explain multiple points, use bullets:
   
   • **First important point**: Explanation here
   • **Second important point**: Explanation here
   • **Your specific situation**: Reference their income/goals with numbers
   
   **Next steps**: [Actionable recommendations]

EXAMPLE OUTPUT:
**You need to save ₱5,000 per month to buy the iPhone 16 in one year.**

Here's the breakdown:

• **Estimated cost**: iPhone 16 will likely cost ₱60,000-₱80,000
• **Timeline**: If you want it in 12 months
• **Monthly target**: ₱60,000 ÷ 12 = ₱5,000 per month
• **Your situation**: With ₱15,000 monthly surplus, this is totally achievable!

**Next steps**: Create a new savings goal in the app to track your progress!
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