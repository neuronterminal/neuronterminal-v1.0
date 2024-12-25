// Separate patterns into their own file
import { IntentPattern } from './types';

export const INTENT_PATTERNS: IntentPattern[] = [
  {
    pattern: /\?$|^(what|why|how|when|where|who|can|could|would|will|do|does|did)/i,
    type: 'question'
  },
  {
    pattern: /^(yes|yeah|sure|okay|alright|indeed|absolutely)/i,
    type: 'agreement'
  },
  {
    pattern: /^(no|nope|not|disagree)/i,
    type: 'disagreement'
  },
  {
    pattern: /^(what do you mean|could you explain|i don't understand)/i,
    type: 'clarification'
  }
];