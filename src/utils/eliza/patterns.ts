import { Pattern } from './types';

export const patterns: Pattern[] = [
  {
    pattern: /\b(hi|hello|hey)\b/i,
    responses: [
      "Hello! How are you feeling today?",
      "Hi there! What brings you here today?",
      "Hello. Please tell me what's on your mind."
    ],
    priority: 1,
    followUp: false
  }
  // ... rest of patterns remain the same
];

// Export the Pattern type
export type { Pattern } from './types';
