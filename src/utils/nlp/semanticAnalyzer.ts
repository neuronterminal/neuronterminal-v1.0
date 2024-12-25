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

  async analyzeSemantics(input: string): Promise<{
    entities: string[];
    relations: string[];
    context: string[];
    complexity: number;
    coherence: number;
  }> {
    this.updateContext(input);
    
    const entities = this.extractEntities(input);
    const relations = this.extractRelations(input);
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

  private async calculateCoherence(input: string): Promise<number> {
    if (this.contextWindow.length < 2) return 1;

    const currentEmbedding = await embedText(input);
    const previousEmbedding = await embedText(this.contextWindow[this.contextWindow.length - 2]);

    const coherence = tf.tidy(() => {
      const similarity = tf.losses.cosineDistance(
        currentEmbedding,
        previousEmbedding,
        0
      );
      return similarity.dataSync()[0];
    });

    return 1 - coherence;
  }

  // ... rest of the methods remain the same
}
