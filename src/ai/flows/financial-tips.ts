'use server';
/**
 * @fileOverview Provides personalized financial tips based on transaction history.
 *
 * - getFinancialTips - A function that generates financial advice based on user transactions.
 * - FinancialTipsInput - The input type for the getFinancialTips function.
 * - FinancialTipsOutput - The return type for the getFinancialTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialTipsInputSchema = z.object({
  transactionHistory: z.string().describe('A summary of the user transaction history.'),
});
export type FinancialTipsInput = z.infer<typeof FinancialTipsInputSchema>;

const FinancialTipsOutputSchema = z.object({
  financialTip: z.string().describe('A personalized financial tip based on the transaction history.'),
});
export type FinancialTipsOutput = z.infer<typeof FinancialTipsOutputSchema>;

export async function getFinancialTips(input: FinancialTipsInput): Promise<FinancialTipsOutput> {
  return financialTipsFlow(input);
}

const financialTipsPrompt = ai.definePrompt({
  name: 'financialTipsPrompt',
  input: {schema: FinancialTipsInputSchema},
  output: {schema: FinancialTipsOutputSchema},
  prompt: `You are a financial advisor. Based on the user's transaction history, provide one personalized financial tip.

Transaction History: {{{transactionHistory}}}

Financial Tip:`, 
});

const financialTipsFlow = ai.defineFlow(
  {
    name: 'financialTipsFlow',
    inputSchema: FinancialTipsInputSchema,
    outputSchema: FinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await financialTipsPrompt(input);
    return output!;
  }
);
