import { Message } from '../../types/agent';

interface MemoryNode {
  content: string;
  type: 'fact' | 'emotion' | 'preference' | 'event';
  timestamp: Date;
  confidence: number;
  references: number;
}

export class MemoryNetwork {
  private shortTermMemory: Message[] = [];
  private longTermMemory: Map<string, MemoryNode> = new Map();
  private associations: Map<string, Set<string>> = new Map();

  addMemory(message: Message) {
    this.shortTermMemory.push(message);
    if (this.shortTermMemory.length > 10) {
      this.consolidateMemory();
    }
    
    const facts = this.extractFacts(message);
    facts.forEach(fact => this.storeFact(fact));
  }

  private consolidateMemory() {
    const oldestMessage = this.shortTermMemory.shift();
    if (!oldestMessage) return;

    const facts = this.extractFacts(oldestMessage);
    facts.forEach(fact => {
      const existing = this.longTermMemory.get(fact.content);
      if (existing) {
        existing.references++;
        existing.confidence = Math.min(existing.confidence + 0.1, 1);
      } else {
        this.longTermMemory.set(fact.content, {
          content: fact.content,
          type: fact.type,
          timestamp: new Date(),
          confidence: 0.5,
          references: 1
        });
      }
    });
  }

  private extractFacts(message: Message): Array<{ content: string; type: MemoryNode['type'] }> {
    const facts: Array<{ content: string; type: MemoryNode['type'] }> = [];
    const content = message.content.toLowerCase();

    // Extract emotional facts
    if (content.includes('feel') || content.includes('emotion')) {
      facts.push({
        content: content,
        type: 'emotion'
      });
    }

    // Extract preferences
    if (content.includes('like') || content.includes('prefer') || content.includes('want')) {
      facts.push({
        content: content,
        type: 'preference'
      });
    }

    // Extract events
    if (content.includes('happened') || content.includes('occurred') || content.includes('when')) {
      facts.push({
        content: content,
        type: 'event'
      });
    }

    return facts;
  }

  private storeFact(fact: { content: string; type: MemoryNode['type'] }) {
    const words = fact.content.split(' ');
    words.forEach(word => {
      if (!this.associations.has(word)) {
        this.associations.set(word, new Set());
      }
      words.forEach(otherWord => {
        if (word !== otherWord) {
          this.associations.get(word)?.add(otherWord);
        }
      });
    });
  }

  getRelevantMemories(context: string): MemoryNode[] {
    const contextWords = new Set(context.toLowerCase().split(' '));
    const relevantMemories: [MemoryNode, number][] = [];

    this.longTermMemory.forEach(memory => {
      const relevanceScore = this.calculateRelevance(memory, contextWords);
      if (relevanceScore > 0.3) {
        relevantMemories.push([memory, relevanceScore]);
      }
    });

    return relevantMemories
      .sort(([, a], [, b]) => b - a)
      .map(([memory]) => memory)
      .slice(0, 3);
  }

  private calculateRelevance(memory: MemoryNode, contextWords: Set<string>): number {
    const memoryWords = new Set(memory.content.toLowerCase().split(' '));
    let relevance = 0;

    memoryWords.forEach(word => {
      if (contextWords.has(word)) {
        relevance += 0.3;
      }
      const associations = this.associations.get(word);
      if (associations) {
        associations.forEach(assoc => {
          if (contextWords.has(assoc)) {
            relevance += 0.1;
          }
        });
      }
    });

    return relevance * memory.confidence;
  }
}