import * as tf from '@tensorflow/tfjs';
import { KnowledgeGraph } from './knowledgeGraph';

export class SemanticAnalyzer {
  private knowledgeGraph: KnowledgeGraph;
  private contextWindow: string[] = [];
  private readonly MAX_CONTEXT_LENGTH = 5;

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
  }

  async calculateCoherence(input: string): Promise<number> {
    if (this.contextWindow.length < 2) return 1;

    const currentEmbedding = await this.getEmbedding(input);
    const previousEmbedding = await this.getEmbedding(this.contextWindow[this.contextWindow.length - 2]);

    const coherence = tf.tidy(() => {
      const similarity = tf.losses.cosineDistance(
        currentEmbedding,
        previousEmbedding,
        0,
        undefined,
        'euclidean'
      );
      return similarity.dataSync()[0];
    });

    return 1 - coherence;
  }

  // ... rest of the file remains the same
}