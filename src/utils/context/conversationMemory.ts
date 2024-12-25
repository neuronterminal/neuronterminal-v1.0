import { Message } from '../../types/agent';
import { EmotionalContext } from '../types/emotions';
import { analyzeEmotion } from '../nlp/sentiment';

export class ConversationMemory {
  private messages: Message[] = [];
  private emotionalContext: EmotionalContext;
  private topics: Set<string> = new Set();
  private entityMentions: Map<string, number> = new Map();

  constructor() {
    this.emotionalContext = {
      currentEmotion: analyzeEmotion(''),
      emotionHistory: [],
      dominantEmotion: 'neutral',
      emotionalTrend: 'stable'
    };
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
    this.updateEmotionalContext(message);
    this.extractTopics(message);
  }

  public getRelevantContext(input: string): Message[] {
    return this.messages
      .filter(msg => this.isContextuallyRelevant(msg, input))
      .slice(-3);
  }

  public getEmotionalContext(): EmotionalContext {
    return this.emotionalContext;
  }

  private updateEmotionalContext(message: Message): void {
    if (message.role === 'user') {
      const emotion = analyzeEmotion(message.content);
      this.emotionalContext.emotionHistory.push(emotion);
      this.emotionalContext.currentEmotion = emotion;
      this.updateEmotionalTrend();
    }
  }

  private updateEmotionalTrend(): void {
    const history = this.emotionalContext.emotionHistory;
    if (history.length < 2) return;

    const recent = history.slice(-3);
    const trend = recent.reduce((acc, curr, idx) => 
      idx === 0 ? 0 : acc + (curr.score - recent[idx - 1].score), 0);

    this.emotionalContext.emotionalTrend = 
      trend > 0 ? 'improving' : 
      trend < 0 ? 'declining' : 'stable';
  }

  private extractTopics(message: Message): void {
    const words = message.content.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        this.topics.add(word);
      }
    });
  }

  private isContextuallyRelevant(message: Message, input: string): boolean {
    const messageWords = new Set(message.content.toLowerCase().split(' '));
    const inputWords = new Set(input.toLowerCase().split(' '));
    const intersection = new Set([...messageWords].filter(x => inputWords.has(x)));
    return intersection.size > 0;
  }
}