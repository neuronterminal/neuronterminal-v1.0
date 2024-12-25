import { Pattern } from '../eliza/types';
import { Message } from '../eliza/types';

export interface ConversationContext {
  topic?: string;
  emotion?: string;
  lastFollowUp: boolean;
  questionCount: number;
  topicDepth: number;
}

export class ConversationState {
  private context: ConversationContext = {
    lastFollowUp: false,
    questionCount: 0,
    topicDepth: 0
  };

  private readonly MAX_FOLLOW_UPS = 2;
  private readonly MAX_TOPIC_DEPTH = 3;

  updateContext(message: Message, pattern: Pattern) {
    // ... rest of the file remains the same
  }
}