export interface Pattern {
  pattern: RegExp;
  responses: string[];
  priority?: number;
  followUp?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface ElizaState {
  memory: string[];
  lastResponse: string | null;
  quitRequested: boolean;
}

export interface Script {
  initial: string;
  final: string;
  quit: string[];
  pre: Record<string, string>;
  post: Record<string, string>;
  synonyms: Record<string, string[]>;
  keywords: Array<{
    word: string;
    rank: number;
    rules: Array<{
      pattern: string;
      responses: Array<{ format: string }>;
    }>;
  }>;
}

export interface ReassemblyRule {
  format: string;
}