import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_CONFIG } from './config';
import { AnthropicClientError, DEFAULT_ERROR_MESSAGE } from './errors';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_CONFIG.apiKey
});

export async function generateAnthropicResponse(input: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: ANTHROPIC_CONFIG.model,
      max_tokens: ANTHROPIC_CONFIG.maxTokens,
      messages: [{
        role: 'user',
        content: input
      }]
    });

    if (!message.content?.[0]?.text) {
      throw new AnthropicClientError({ 
        message: 'Invalid response format from Anthropic API' 
      });
    }

    return message.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    
    if (error instanceof AnthropicClientError) {
      throw error;
    }
    
    throw new AnthropicClientError({ 
      message: DEFAULT_ERROR_MESSAGE 
    });
  }
}