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

  private updateContext(input: string): void {
    this.contextWindow.push(input);
    if (this.contextWindow.length > this.MAX_CONTEXT_LENGTH) {
      this.contextWindow.shift();
    }
  }

  private extractEntities(input: string): string[] {
    const entities: string[] = [];
    const words = input.split(' ');
    
    words.forEach((word, index) => {
      if (this.isNamedEntity(word)) {
        entities.push(word);
      }
      
      if (index < words.length - 1 && 
          this.isNamedEntity(word) && 
          this.isNamedEntity(words[index + 1])) {
        entities.push(`${word} ${words[index + 1]}`);
      }
    });

    return entities;
  }

  private extractRelations(input: string): string[] {
    const relations: string[] = [];
    const patterns = [
      /(\w+)\s+(is|are|was|were)\s+(\w+)/g,
      /(\w+)\s+(has|have|had)\s+(\w+)/g,
      /(\w+)\s+(uses|used|using)\s+(\w+)/g
    ];

    patterns.forEach(pattern => {
      const matches = Array.from(input.matchAll(pattern));
      matches.forEach(match => {
        relations.push(`${match[1]}-${match[2]}-${match[3]}`);
      });
    });

    return relations;
  }

  private calculateComplexity(input: string): number {
    const words = input.split(' ');
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const uniqueWords = new Set(words).size;
    
    return (avgWordLength * 0.3 + (uniqueWords / words.length) * 0.7);
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

  private isNamedEntity(word: string): boolean {
    return /^[A-Z][a-z]+$/.test(word) && !this.isCommonWord(word);
  }

  private isCommonWord(word: string): boolean {
    const commonWords = new Set(['I', 'The', 'A', 'An', 'This', 'That']);
    return commonWords.has(word);
  }
}
