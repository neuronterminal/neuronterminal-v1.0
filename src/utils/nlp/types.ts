// Shared types for NLP functionality
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

export interface KnowledgeNode {
  id: string;
  concept: string;
  type: 'entity' | 'concept' | 'fact' | 'relation';
  properties: Record<string, any>;
  connections: Set<string>;
  confidence: number;
  relevance: number;
}

export interface SemanticAnalysis {
  entities: string[];
  relations: string[];
  context: string[];
  complexity: number;
  coherence: number;
}
