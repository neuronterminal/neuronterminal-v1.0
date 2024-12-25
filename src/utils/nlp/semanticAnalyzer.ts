import * as tf from '@tensorflow/tfjs';
import { KnowledgeGraph } from './knowledgeGraph';
import { embedText } from '../ml/encoder';

export class SemanticAnalyzer {
  private knowledgeGraph: KnowledgeGraph;
  private contextWindow: string[] = [];
  private readonly MAX_CONTEXT_LENGTH = 5;

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
  }

  async analyzeSemantics(input: string) {
    this.updateContext(input);
    
    const [entities, relations] = await Promise.all([
      this.extractEntities(input),
      this.extractRelations(input)
    ]);

    const complexity = this.calculateComplexity(input);
    const coherence = await this.calculateCoherence(input);

    return {
      entities,
      relations,
      context: [...this.contextWindow],
      complexity,
      coherence
    };
  }

  private updateContext(input: string) {
    this.contextWindow.push(input);
    if (this.contextWindow.length > this.MAX_CONTEXT_LENGTH) {
      this.contextWindow.shift();
    }
  }

  // ... rest of the methods remain the same
}
