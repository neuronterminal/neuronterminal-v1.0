// Move shared types to a dedicated types file
export type IntentType = 'question' | 'statement' | 'emotional_expression' | 'agreement' | 'disagreement' | 'clarification' | 'technical';

export interface Intent {
  type: IntentType;
  confidence: number;
  entities: string[];
  sentiment: number;
}

export interface IntentPattern {
  pattern: RegExp;
  type: IntentType;
}