import { AnthropicError } from './types';

export class AnthropicClientError extends Error {
  constructor(error: AnthropicError) {
    super(error.message);
    this.name = 'AnthropicClientError';
  }
}

export const DEFAULT_ERROR_MESSAGE = 'I apologize, but I encountered an error processing your request. Could you please try again?';