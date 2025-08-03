
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
  goalType: z.string().describe('The category of the goal (e.g., "car", "house", "vacation", "investment", "emergency").'),
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
            { "name": "Petron BPI Card", "details": "Get as much as one free full tank with your partner card on the road.", "url": "https://www.bpi.com.ph/personal/cards/credit-cards/petron-bpi-mastercard" },
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
            { "name": "Auto Loan", "details": "Finance a brand new or second-hand car.", "eligibleGoals": ["car"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan" },
            { "name": "MyKotse", "details": "An auto loan offer with up to 84 months loan term.", "eligibleGoals": ["car"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan/passenger-car/mykotse" },
            { "name": "Big Bike Loan", "details": "Finance your dream big bike.", "eligibleGoals": ["motorcycle", "bike"], "url": "https://www.bpi.com.ph/personal/loans/auto-loan/big-bike" }
        ],
        "HOUSING_LOAN": [
            { "name": "Housing Loan", "details": "Make your dream home a reality.", "eligibleGoals": ["house"], "url": "https://www.bpi.com.ph/personal/loans/housing-loan/buy" },
            { "name": "MyBahay", "details": "Affordable home financing with low downpayment and longer payment terms.", "eligibleGoals": ["house"], "url": "https://www.bpi.com.ph/personal/loans/housing-loan/buy/mybahay" }
        ],
        "PERSONAL_LOAN": [
            { "name": "Personal Loan", "details": "Get extra cash for your different needs like home renovation, education, business, or travel.", "eligibleGoals": ["emergency", "vacation", "business", "education", "renovation"], "url": "https://www.bpi.com.ph/personal/loans/personal-loan/regular" }
        ]
    },
    "INVESTMENTS": {
        "UITF": [
            { "name": "BPI Short Term Fund", "details": "A must-have fund for emergencies or immediate cash needs.", "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/short-term-invest-fund" },
            { "name": "BPI Philippine Equity Index Fund", "details": "Ride the Philippine economic growth through investments in top local companies.", "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/philippine-equity-index-fund" },
            { "name": "BPI US Equity Index Feeder Fund", "details": "Global diversification through the largest companies in the US.", "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/funds/us-equity-index-feeder-fund" }
        ],
        "MUTUAL_FUNDS": [
             { "name": "ALFM Peso Bond Fund", "details": "Ideal for investors who are looking for a well-diversified fixed-income investment fund.", "url": "https://www.alfmmutualfunds.com/funds/alfm-peso-bond-fund" },
             { "name": "Philippine Stock Index Fund", "details": "Suitable for investors who seek long-term capital growth, or those who want to track the performance of the PSEi.", "url": "https://www.alfmmutualfunds.com/funds/philippine-stock-index-fund" }
        ],
         "PERA": [
            { "name": "BPI PERA Equity Fund", "details": "Strengthen your retirement plan with this tax-advantaged investment.", "url": "https://www.bpi.com.ph/wealth/assetandwealth/investment-solutions/pera/equity-fund" }
        ]
    }
};


const prompt = ai.definePrompt({
  name: 'productRecommenderPrompt',
  input: { schema: ProductRecommenderInputSchema },
  output: { schema: ProductRecommenderOutputSchema },
  prompt: `You are a sophisticated BPI financial advisor AI. Your primary goal is to provide intelligent, personalized, and actionable product recommendations to users based on their financial simulation.

Analyze the user's situation holistically. Go beyond simple goal matching. Consider their income, expenses, savings capacity, and the nature of their goal to recommend the most appropriate financial products from the comprehensive BPI product list provided.

User's Financial Scenario:
- Monthly Income: ₱{{{monthlyIncome}}}
- Monthly Expenses: ₱{{{monthlyExpenses}}}
- Savings Goal: ₱{{{savingsGoal}}} in {{{timeframe}}} months.
- Goal Type: "{{{goalType}}}"

Your Thought Process:
1.  Calculate the user's monthly savings (income - expenses). This is their capacity to save or invest.
2.  Calculate the total projected savings over the timeframe (monthly savings * timeframe).
3.  Determine the financial position: Is there a surplus (projected savings > goal) or a shortfall (projected savings < goal)?
4.  Analyze the Goal Type and Timeframe: Is it a short-term goal (e.g., emergency fund, vacation) or a long-term one (e.g., house, retirement)? This dictates the risk appetite.
5.  Recommend Products Based on Analysis:
    - **If there's a significant shortfall for a large, necessary purchase (e.g., house, car):** A relevant LOAN is a primary recommendation. Match the loan type to the goal.
    - **If there's a small shortfall or the user needs to build savings:** Recommend a suitable SAVINGS account. For users starting out, suggest accounts with low initial deposits. For those with more funds, suggest higher-yield accounts like Maxi-Saver or a Time Deposit.
    - **If there's a surplus or the goal is long-term growth (e.g., "investment", "retirement"):** Recommend an INVESTMENT product. Suggest Money Market funds (like BPI Short Term Fund) for low-risk/emergency funds, and Equity funds (like BPI Philippine Equity Index Fund or a PERA fund for retirement) for higher growth potential.
    - **For general spending or specific perks (e.g., travel, cashback):** A CREDIT CARD could be a supplementary recommendation. Match the card's benefits to the user's goal type or lifestyle (e.g., Amore Cashback for savings on essentials, Platinum Rewards for travel).

Your Response:
- Provide 1 to 3 diverse and relevant recommendations.
- For each recommendation, provide a compelling, personalized reason. Explain *why* it fits their specific situation (e.g., "Since you have a ₱15,000 monthly surplus, you can channel this into the BPI Philippine Equity Index Fund to grow your money faster for your long-term goal.").
- The clarification should be a simple, one-sentence explanation of the product type.
- Do not recommend products if they don't make sense for the user's financial situation. For example, don't recommend a high-end investment product to someone with no savings.

Available BPI Products (for your reference only, do not show this structure to the user):
${JSON.stringify(BPI_PRODUCTS_DATA, null, 2)}
`,
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
