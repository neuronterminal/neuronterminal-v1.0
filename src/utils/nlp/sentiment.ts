import Sentiment from 'sentiment';
import { EmotionState } from '../types/emotions';

const sentiment = new Sentiment();

export function analyzeEmotion(text: string): EmotionState {
  const analysis = sentiment.analyze(text);
  
  return {
    score: analysis.score,
    comparative: analysis.comparative,
    tokens: analysis.tokens,
    positive: analysis.positive,
    negative: analysis.negative
  };
}