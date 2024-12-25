import { KnowledgeGraph } from './knowledgeGraph';
import { Intent } from './intentRecognition';

export class ReasoningEngine {
  private knowledgeGraph: KnowledgeGraph;

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
  }

  async generateResponse(intent: Intent, context: string): Promise<string> {
    const relatedConcepts = this.knowledgeGraph.findRelatedConcepts(context);
    
    switch (intent.type) {
      case 'question':
        return this.generateInformativeResponse(context, relatedConcepts);
      case 'emotional_expression':
        return this.generateEmpatheticResponse(intent.sentiment, context);
      case 'clarification':
        return this.generateClarification(context, relatedConcepts);
      default:
        return this.generateContextualResponse(context, intent);
    }
  }

  private generateInformativeResponse(context: string, relatedConcepts: any[]): string {
    if (relatedConcepts.length === 0) {
      return "I understand you're asking about " + context + ". Could you provide more context or specify what aspect you'd like to know about?";
    }

    const mostRelevant = relatedConcepts[0];
    return `Based on my understanding of ${context}, ${mostRelevant.concept} is particularly relevant. Would you like to explore that connection?`;
  }

  private generateEmpatheticResponse(sentiment: number, context: string): string {
    if (sentiment > 0.3) {
      return `I sense your positive feelings about ${context}. What aspects make you feel this way?`;
    } else if (sentiment < -0.3) {
      return `I understand that ${context} brings up challenging feelings. Would you like to discuss what's troubling you?`;
    }
    return `I notice you have complex feelings about ${context}. Could you tell me more about your perspective?`;
  }

  private generateClarification(context: string, relatedConcepts: any[]): string {
    const concepts = relatedConcepts.slice(0, 2).map(c => c.concept).join(' and ');
    return `Let me clarify: ${context} is related to ${concepts}. Which aspect would you like me to explain further?`;
  }

  private generateContextualResponse(context: string, intent: Intent): string {
    return `I understand you're interested in ${context}. Based on our conversation, I can provide more specific information about aspects that interest you.`;
  }
}