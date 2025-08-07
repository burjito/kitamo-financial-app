'use server';

/**
 * @fileOverview An AI flow for recommending BPI financial products.
 *
 * - recommendProducts - A function that suggests products based on a user's financial scenario.
 * - ProductRecommenderInput - The input type for the recommendProducts function.
 * - ProductRecommenderOutput - The return type for the recommendProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas for input, output, and individual products
const ProductRecommenderInputSchema = z.object({
  monthlyIncome: z.number().describe('User\'s monthly income.'),
  monthlyExpenses: z.number().describe('User\'s monthly expenses.'),
  savingsGoal: z.number().describe('The total amount of the user\'s savings goal.'),
  timeframe: z.number().describe('The user\'s desired timeframe in months to reach the goal.'),
  goalType: z.string().describe('The category of the goal (e.g., "car", "house", "vacation", "investment", "emergency", "big bike", "motorcycle").'),
});
export type ProductRecommenderInput = z.infer<typeof ProductRecommenderInputSchema>;

const ProductRecommendationSchema = z.object({
  productName: z.string().describe('The name of the recommended BPI product.'),
  productType: z.enum(["Loan", "Investment", "Savings", "Credit Card", "Insurance"]).describe("The category of the product."),
  recommendationReason: z.string().describe('A clear, concise reason why this product is being recommended for the user\'s specific scenario.'),
  clarification: z.string().describe("A short sentence clarifying what the product is, e.g., 'A personal loan is a type of credit you can use for various purposes.'"),
  url: z.string().describe('A link to the official BPI product page.'),
});
export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

const ProductRecommenderOutputSchema = z.object({
  recommendations: z.array(ProductRecommendationSchema).describe('A list of up to 3 recommended BPI products.'),
});
export type ProductRecommenderOutput = z.infer<typeof ProductRecommenderOutputSchema>;

// Main exported function
export async function recommendProducts(input: ProductRecommenderInput): Promise<ProductRecommenderOutput> {
  return productRecommenderFlow(input);
}

const BPI_PRODUCTS_DATA = {
    "ACCOUNTS": {
        "SAVINGS": [
            { "name": "Saver-Plus", "details": "A savings account that rewards you now while you save for your future.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/saver-plus" },
            { "name": "#SaveUp", "details": "An all-digital savings account that allows you to do more and earn more.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/digital-saveup" },
            { "name": "Jumpstart", "details": "A savings account specially designed for teens aged 10-17.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/jumpstart-savings" },
            { "name": "Save-Up High", "details": "A savings account that allows you to automatically set aside money regularly while earning interest.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/saveup-high" },
            { "name": "#MySaveUp", "details": "An all-digital BPI savings account that you can exclusively open using the GCash app.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/my-saveup" },
            { "name": "Maxi-Saver", "details": "A premium savings account with bonus interest rate and exclusive features.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/maxi-saver" },
            { "name": "Passbook", "details": "A savings account that earns interest on your funds while allowing you to monitor your transactions.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/passbook" },
            { "name": "Save-Up", "details": "A savings account that automatically sets aside money. Plus, you get free life and accident insurance.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/saveup" },
            { "name": "Regular Savings", "details": "A savings account with electronic banking convenience.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/regular-savings" },
            { "name": "Pamana Savings", "details": "A savings account that gives free life insurance worth 3x your account balance.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/pamana-savings" },
            { "name": "US Dollar Savings", "details": "Let your dollars grow with us and enjoy maximum convenience in monitoring your account.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/foreign-currency-savings" },
            { "name": "Pamana Padala", "details": "A remittance solution where you can remit your hard earned salaries and manage remittances effectively.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/pamana-padala" },
            { "name": "Padala Moneyger", "details": "A secure savings account that makes it easier to manage remittances from abroad.", "url": "https://www.bpi.com.ph/personal/bank/savings-accounts/padala-moneyger" }
        ],
        "TIME_DEPOSIT": [
            { "name": "Peso Auto Renew", "details": "Earn more than a regular savings account with a time deposit that automatically renews your placement.", "url": "https://www.bpi.com.ph/personal/bank/time-deposit-accounts/peso-auto-renew" },
            { "name": "BPI Green Saver Time Deposit Account", "details": "An environment-friendly 5-year time deposit that gives higher interest rates.", "url": "https://www.bpi.com.ph/personal/bank/time-deposit-accounts/green-saver" },
            { "name": "Plan Ahead Time Deposit", "details": "Grow your hard-earned funds with a five-year time deposit. Enjoy a high interest rate, fixed for the entire term, tax-free.", "url": "https://www.bpi.com.ph/personal/bank/time-deposit-accounts/5-year-plan-ahead" }
        ]
    },
    "CARDS": {
        "CREDIT_CARDS": [
            { "name": "BPI Platinum Rewards Card", "details": "Elevate to a platinum rewards experience like no other.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/bpi-platinum-rewards-mastercard" },
            { "name": "BPI Signature Card", "details": "The card that fits your Signature lifestyle.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/visa-signature" },
            { "name": "BPI Gold Rewards Card", "details": "Discover a world of endless rewards with a BPI Gold Rewards Card.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/bpi-gold-mastercard" },
            { "name": "BPI Rewards Card", "details": "Earn BPI Rewards Points for shopping credits, vouchers, miles, and more.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/bpi-blue-mastercard" },
            { "name": "BPI Amore Platinum Cashback Card", "details": "Earn cashback anywhere you shop and enjoy exclusive perks at Ayala Malls.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/amore-visa-platinum" },
            { "name": "BPI Amore Cashback Card", "details": "Earn cashback on your essentials and other local expenses.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/amore-visa-classic" },
            { "name": "Petron BPI Card", "details": "Get as much as one free full tank with your partner card on the road.", "eligibleGoals": ["car", "motorcycle", "big bike", "bike"], "url": "https://www.bpi.com.ph/personal/cards/credit-cards/petron-bpi-mastercard" },
            { "name": "BPI Edge Card", "details": "Experience a cutting-edge lifestyle with our exclusive rewards and perks.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/bpi-edge-mastercard" },
            { "name": "BPI DOS Card", "details": "All your purchases are automatically converted to a 2-month installment.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/bpi-dos-card" },
            { "name": "Robinsons Cashback Card", "details": "Enjoy up to 3% rebate at Robinsons Stores and up to 1% rebate on all other merchants.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/robinsons-cashback-card" }
        ],
        "DEBIT_CARDS": [
            { "name": "BPI Debit Mastercard", "details": "Experience convenience like no other while keeping your transactions safe and secure.", "url": "https://www.bpi.com.ph/personal/cards/debit-cards/debit-mastercard" }
        ]
    },
    "LOANS": {
        "AUTO_LOAN": [
            { "name": "Auto Loan", "details": "Finance a brand new or second-hand car.", "eligibleGoals": ["car", "vehicle", "automobile"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan" },
            { "name": "MyKotse", "details": "An auto loan offer with up to 84 months loan term.", "eligibleGoals": ["car", "vehicle", "automobile"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan/passenger-car/mykotse" },
            { "name": "Big Bike Loan", "details": "Finance your dream big bike.", "eligibleGoals": ["motorcycle", "bike", "big bike", "motorbike", "motor"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan/big-bike" }
        ],
        "HOUSING_LOAN": [
            { "name": "Housing Loan", "details": "Make your dream home a reality.", "eligibleGoals": ["house", "home", "property", "real estate"], "url": "https://www.bpi.com.ph/personal/loans/housing-loan/buy" },
            { "name": "MyBahay", "details": "Affordable home financing with low downpayment and longer payment terms.", "eligibleGoals": ["house", "home", "property", "real estate"], "url": "https://www.bpi.com.ph/personal/loans/housing-loan/buy/mybahay" }
        ],
        "PERSONAL_LOAN": [
            { "name": "Personal Loan", "details": "Get extra cash for your different needs like home renovation, education, business, or travel.", "eligibleGoals": ["emergency", "vacation", "business", "education", "renovation", "travel", "personal", "general"], "url": "https://www.bpi.com.ph/personal/loans/personal-loan/regular" }
        ]
    },
    "INVESTMENTS": {
        "UITF": [
            { "name": "BPI Short Term Fund", "details": "A must-have fund for emergencies or immediate cash needs.", "eligibleGoals": ["emergency", "short-term", "liquidity"], "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/short-term-invest-fund" },
            { "name": "BPI Philippine Equity Index Fund", "details": "Ride the Philippine economic growth through investments in top local companies.", "eligibleGoals": ["investment", "long-term", "growth", "retirement"], "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/philippine-equity-index-fund" },
            { "name": "BPI US Equity Index Feeder Fund", "details": "Global diversification through the largest companies in the US.", "eligibleGoals": ["investment", "long-term", "growth", "retirement", "international"], "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/us-equity-index-feeder-fund" }
        ],
        "MUTUAL_FUNDS": [
             { "name": "ALFM Peso Bond Fund", "details": "Ideal for investors who are looking for a well-diversified fixed-income investment fund.", "eligibleGoals": ["investment", "conservative", "stable income"], "url": "https://www.alfmmutualfunds.com/funds/alfm-peso-bond-fund" },
             { "name": "Philippine Stock Index Fund", "details": "Suitable for investors who seek long-term capital growth, or those who want to track the performance of the PSEi.", "eligibleGoals": ["investment", "long-term", "growth"], "url": "https://www.alfmmutualfunds.com/funds/philippine-stock-index-fund" }
        ],
         "PERA": [
            { "name": "BPI PERA Equity Fund", "details": "Strengthen your retirement plan with this tax-advantaged investment.", "eligibleGoals": ["retirement", "long-term", "tax-advantaged"], "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/pera/equity-fund" }
        ]
    }
};

const prompt = ai.definePrompt({
  name: 'productRecommenderPrompt',
  input: { schema: ProductRecommenderInputSchema },
  output: { schema: ProductRecommenderOutputSchema },
  prompt: `You are a sophisticated BPI financial advisor AI specializing in precise product matching. Your primary goal is to recommend the MOST RELEVANT BPI products that directly address the user's specific goal and financial situation.

CRITICAL INSTRUCTION: You MUST prioritize products that directly match the user's goal type. If the user's goal is "big bike", "motorcycle", "bike", or "motorbike", you MUST recommend the "Big Bike Loan" as the primary recommendation.

User's Financial Scenario:
- Monthly Income: ₱{{{monthlyIncome}}}
- Monthly Expenses: ₱{{{monthlyExpenses}}}
- Savings Goal: ₱{{{savingsGoal}}} in {{{timeframe}}} months.
- Goal Type: "{{{goalType}}}"

STEP-BY-STEP ANALYSIS PROCESS:

1. **GOAL MATCHING FIRST** - Look for products with eligibleGoals that match the user's goalType exactly:
   - For "big bike", "motorcycle", "bike", "motorbike", "motor" → MUST recommend "Big Bike Loan"
   - For "car", "vehicle", "automobile" → recommend "Auto Loan" or "MyKotse"
   - For "house", "home", "property" → recommend "Housing Loan" or "MyBahay"
   - For other goals, find matching products in the eligibleGoals arrays

2. **FINANCIAL ANALYSIS** - Calculate financial capacity:
   - Monthly Savings = Monthly Income - Monthly Expenses
   - Total Projected Savings = Monthly Savings × Timeframe
   - Gap Analysis = Savings Goal - Total Projected Savings

3. **PRODUCT RECOMMENDATION LOGIC**:
   - **If there's a SIGNIFICANT SHORTFALL (Gap > 50% of goal) AND the goal has a matching loan product**: Recommend the specific loan as PRIMARY recommendation
   - **If moderate shortfall or building savings**: Recommend appropriate savings products
   - **If surplus or investment goal**: Recommend investment products
   - **For lifestyle goals**: Consider credit cards with relevant benefits

4. **PRIORITIZATION RULES**:
   - ALWAYS prioritize exact goal matches from eligibleGoals
   - For vehicle-related goals, Big Bike Loan takes priority over general auto loans when goal contains "bike", "motorcycle", etc.
   - For fuel/vehicle expenses, consider Petron BPI Card as secondary recommendation

GOAL TYPE MATCHING TABLE (MANDATORY TO FOLLOW):
- "big bike", "motorcycle", "bike", "motorbike", "motor" → "Big Bike Loan" (PRIMARY)
- "car", "vehicle", "automobile" → "Auto Loan" or "MyKotse"
- "house", "home", "property", "real estate" → "Housing Loan" or "MyBahay"
- "emergency" → "BPI Short Term Fund" or emergency-friendly savings
- "investment", "retirement" → Equity funds or PERA
- "vacation", "travel" → "Personal Loan" if shortfall exists

Your Response Requirements:
- Provide 1-3 recommendations with the MOST RELEVANT product first
- For each recommendation, explain WHY it specifically matches their goal and financial situation
- Include one sentence clarification of what the product type is
- If recommending a loan, explain how it bridges their financial gap
- Never recommend products that don't align with the user's specific goal

Available BPI Products Database:
${JSON.stringify(BPI_PRODUCTS_DATA, null, 2)}

REMEMBER: Goal matching is PARAMOUNT. If someone wants a big bike, the Big Bike Loan must be recommended if there's any financial shortfall.`,
});

const productRecommenderFlow = ai.defineFlow(
  {
    name: 'productRecommenderFlow',
    inputSchema: ProductRecommenderInputSchema,
    outputSchema: ProductRecommenderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);