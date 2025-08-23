'use server';
/**
 * @fileOverview An AI agent that generates React code with Tailwind styling from a natural language description.
 *
 * - generateUIFromDescription - A function that handles the UI code generation process.
 * - GenerateUIFromDescriptionInput - The input type for the generateUIFromDescription function.
 * - GenerateUIFromDescriptionOutput - The return type for the generateUIFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUIFromDescriptionInputSchema = z.object({
  description: z.string().describe('A natural language description of the UI component to generate.'),
});
export type GenerateUIFromDescriptionInput = z.infer<
  typeof GenerateUIFromDescriptionInputSchema
>;

const GenerateUIFromDescriptionOutputSchema = z.object({
  code: z
    .string()
    .describe('The generated React code with Tailwind styling for the UI component.'),
});
export type GenerateUIFromDescriptionOutput = z.infer<
  typeof GenerateUIFromDescriptionOutputSchema
>;

export async function generateUIFromDescription(
  input: GenerateUIFromDescriptionInput
): Promise<GenerateUIFromDescriptionOutput> {
  return generateUIFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUIFromDescriptionPrompt',
  input: {schema: GenerateUIFromDescriptionInputSchema},
  output: {schema: GenerateUIFromDescriptionOutputSchema},
  prompt: `You are an expert React code generator with Tailwind CSS.

  Based on the description provided, generate React code with Tailwind styling for the UI component.
  Return only the code, do not include any explanations or comments outside of the code itself.

  Description: {{{description}}}
  `,
});

const generateUIFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateUIFromDescriptionFlow',
    inputSchema: GenerateUIFromDescriptionInputSchema,
    outputSchema: GenerateUIFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
