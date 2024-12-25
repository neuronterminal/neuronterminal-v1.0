import { KnowledgeGraph } from './knowledgeGraph';
import { ConceptLearner } from './conceptLearner';
import { ReasoningEngine } from './reasoningEngine';
import * as tf from '@tensorflow/tfjs';

export class LanguageProcessor {
  private knowledgeGraph: KnowledgeGraph;
  private conceptLearner: ConceptLearner;
  private reasoningEngine: ReasoningEngine;
  private embeddings: Map<string, tf.Tensor> = new Map();

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
    this.conceptLearner = new ConceptLearner();
    this.reasoningEngine = new ReasoningEngine();
  }

  async processInput(input: string): Promise<{
    concepts: string[];
    sentiment: number;
    topics: string[];
    technicalContent: boolean;
    codeSnippets: string[];
    suggestedResponses: string[];
  }> {
    const concepts = await this.extractConcepts(input);
    const sentiment = await this.analyzeSentiment(input);
    const topics = this.identifyTopics(input);
    const technicalContent = this.containsTechnicalContent(input);
    const codeSnippets = this.extractCodeSnippets(input);
    
    const suggestedResponses = await this.generateResponses(
      input,
      concepts,
      sentiment,
      technicalContent
    );

    return {
      concepts,
      sentiment,
      topics,
      technicalContent,
      codeSnippets,
      suggestedResponses
    };
  }

  private async extractConcepts(input: string): Promise<string[]> {
    const embedding = await this.getEmbedding(input);
    const concepts = this.conceptLearner.getSimilarConcepts(input);
    
    // Add new concepts to knowledge graph
    concepts.forEach(concept => {
      this.knowledgeGraph.addNode(concept, 'concept', {
        embedding: embedding.arraySync()
      });
    });

    return concepts;
  }

  private async analyzeSentiment(input: string): Promise<number> {
    // Enhanced sentiment analysis using TensorFlow.js
    const embedding = await this.getEmbedding(input);
    const sentimentScore = tf.tidy(() => {
      const normalized = tf.norm(embedding).arraySync();
      return (normalized as number - 0.5) * 2;
    });

    return sentimentScore;
  }

  private identifyTopics(input: string): string[] {
    const topics = new Set<string>();
    
    // Technical topics
    if (input.match(/\b(code|programming|development|software|api|database)\b/i)) {
      topics.add('technology');
    }
    
    // AI/ML topics
    if (input.match(/\b(ai|machine learning|neural network|deep learning)\b/i)) {
      topics.add('artificial intelligence');
    }
    
    // Problem-solving topics
    if (input.match(/\b(error|bug|issue|problem|fix|solution)\b/i)) {
      topics.add('troubleshooting');
    }

    return Array.from(topics);
  }

  private containsTechnicalContent(input: string): boolean {
    return Boolean(
      input.match(/```|\b(function|class|import|const|let|var|def|return)\b/i) ||
      input.match(/\b(api|endpoint|database|query|server|client)\b/i)
    );
  }

  private extractCodeSnippets(input: string): string[] {
    const codeBlocks = input.match(/```[\s\S]+?```/g) || [];
    return codeBlocks.map(block => block.replace(/```/g, '').trim());
  }

  private async generateResponses(
    input: string,
    concepts: string[],
    sentiment: number,
    isTechnical: boolean
  ): Promise<string[]> {
    const responses: string[] = [];

    if (isTechnical) {
      responses.push(
        await this.reasoningEngine.generateResponse({
          type: 'technical',
          confidence: 0.9,
          entities: concepts,
          sentiment
        }, input)
      );
    }

    // Add contextual responses based on concepts
    concepts.forEach(concept => {
      const relatedNodes = this.knowledgeGraph.findRelatedConcepts(concept);
      if (relatedNodes.length > 0) {
        responses.push(
          `This relates to ${relatedNodes.map(n => n.concept).join(', ')}. Would you like to explore these connections?`
        );
      }
    });

    return responses;
  }

  private async getEmbedding(text: string): Promise<tf.Tensor> {
    if (this.embeddings.has(text)) {
      return this.embeddings.get(text)!;
    }

    const embedding = await tf.tidy(() => {
      const encoded = tf.tensor1d(
        Array.from(text).map(c => c.charCodeAt(0))
      );
      return tf.expandDims(encoded, 0);
    });

    this.embeddings.set(text, embedding);
    return embedding;
  }
}