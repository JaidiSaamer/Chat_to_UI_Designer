'use server';

import { generateUIFromDescription } from '@/ai/flows/generate-ui-from-description';

export async function generateUiAction(prompt: string): Promise<{
  error?: string;
  generatedCode?: string;
}> {
  if (!prompt || prompt.length < 10) {
    return { error: 'Please enter a more descriptive prompt (at least 10 characters).' };
  }
  
  try {
    const result = await generateUIFromDescription({ description: prompt });
    
    // Clean up potential markdown code blocks from the AI response
    const code = result.code.replace(/```(jsx|tsx|javascript)?\n?/, '').replace(/```$/, '');
    
    return { generatedCode: code };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while generating the UI. This can happen with complex requests. Please try again with a simpler prompt.' };
  }
}
