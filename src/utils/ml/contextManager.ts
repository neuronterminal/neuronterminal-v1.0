import { Message } from '../eliza/types';
import { getSimilarity } from './encoder';

export class ContextManager {
  private memory: Message[] = [];
  private contextWindow = 5;

  async addMessage(message: Message) {
    this.memory.push(message);
    if (this.memory.length > 50) {
      this.memory.shift();
    }
  }

  async findRelevantContext(query: string): Promise<Message[]> {
    const similarities = await Promise.all(
      this.memory.map(msg => getSimilarity(query, msg.content))
    );
    
    return this.memory
      .map((msg, i) => ({ msg, similarity: similarities[i] }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, this.contextWindow)
      .map(item => item.msg);
  }

  async getContextualResponse(input: string, responses: string[]): Promise<string> {
    const context = await this.findRelevantContext(input);
    const contextText = context.map(m => m.content).join(' ');
    
    const similarities = await Promise.all(
      responses.map(response => getSimilarity(contextText, response))
    );
    
    const bestIndex = similarities.indexOf(Math.max(...similarities));
    return responses[bestIndex];
  }
}