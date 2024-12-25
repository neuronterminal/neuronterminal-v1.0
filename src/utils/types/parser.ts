export interface ParsedInput {
  topics: any[];
  verbs: any[];
  nouns: any[];
  sentiment: number;
  questions: any[];
  statements: any[];
  tense: string;
  isQuestion: boolean;
  isNegative: boolean;
  entities: any[];
}