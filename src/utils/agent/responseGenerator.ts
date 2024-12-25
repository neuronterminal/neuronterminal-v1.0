import { generateResponse as generateElizaResponse } from '../eliza/elizaCore';
import { generateAnthropicResponse } from '../anthropic/client';

export type ResponseMode = 'eliza' | 'claude';

export async function generateResponse(input: string, mode: ResponseMode = 'claude'): Promise<string> {
  if (mode === 'eliza') {
    return generateElizaResponse(input);
  }
  
  return generateAnthropicResponse(input);
}