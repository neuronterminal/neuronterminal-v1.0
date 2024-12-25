export interface EmotionState {
  score: number;
  comparative: number;
  tokens: string[];
  positive: string[];
  negative: string[];
}

export interface EmotionalContext {
  currentEmotion: EmotionState;
  emotionHistory: EmotionState[];
  dominantEmotion: string;
  emotionalTrend: 'improving' | 'declining' | 'stable';
}