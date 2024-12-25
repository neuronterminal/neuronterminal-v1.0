import { Intent, IntentType } from './types';
import { INTENT_PATTERNS } from './patterns';

export class IntentRecognizer {
  analyze(message: string): Intent {
    const intent = this.recognizeIntent(message);
    const entities = this.extractEntities(message);
    const sentiment = this.analyzeSentiment(message);

    return {
      type: intent,
      confidence: this.calculateConfidence(message, intent),
      entities,
      sentiment
    };
  }

  private recognizeIntent(message: string): IntentType {
    for (const { pattern, type } of INTENT_PATTERNS) {
      if (pattern.test(message)) {
        return type;
      }
    }
    return this.hasEmotionalContent(message) ? 'emotional_expression' : 'statement';
  }

  private hasEmotionalContent(message: string): boolean {
    const emotionalWords = [
      'feel', 'feeling', 'felt', 'happy', 'sad', 'angry', 'excited',
      'worried', 'anxious', 'love', 'hate', 'afraid', 'scared'
    ];
    return emotionalWords.some(word => message.toLowerCase().includes(word));
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = [];
    const words = message.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      if (this.isCapitalized(words[i]) && !this.isStartOfSentence(words, i)) {
        entities.push(words[i]);
      }
    }
    
    return entities;
  }

  private isCapitalized(word: string): boolean {
    return /^[A-Z]/.test(word);
  }

  private isStartOfSentence(words: string[], index: number): boolean {
    if (index === 0) return true;
    return /[.!?]\s*$/.test(words[index - 1]);
  }

  private analyzeSentiment(message: string): number {
    const positiveWords = new Set(['good', 'great', 'happy', 'excellent', 'wonderful', 'love']);
    const negativeWords = new Set(['bad', 'terrible', 'sad', 'awful', 'hate', 'angry']);
    
    const words = message.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.has(word)) score += 1;
      if (negativeWords.has(word)) score -= 1;
    });
    
    return score / words.length;
  }

  private calculateConfidence(message: string, intent: IntentType): number {
    const matchingPatterns = INTENT_PATTERNS.filter(({ pattern }) => pattern.test(message));
    const matchStrength = matchingPatterns.length;
    return Math.min(0.5 + (matchStrength * 0.25), 1);
  }
}