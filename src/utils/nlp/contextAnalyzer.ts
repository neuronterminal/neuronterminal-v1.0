import { Message } from '../../types/agent';

interface TopicAnalysis {
  currentTopic: string | null;
  topicHistory: string[];
  repetitionCount: number;
}

export class ContextAnalyzer {
  private topicAnalysis: TopicAnalysis = {
    currentTopic: null,
    topicHistory: [],
    repetitionCount: 0
  };

  private readonly TOPIC_KEYWORDS = {
    technology: ['computer', 'software', 'hardware', 'programming', 'code', 'app', 'website'],
    science: ['physics', 'chemistry', 'biology', 'research', 'experiment', 'theory'],
    business: ['company', 'startup', 'market', 'finance', 'investment', 'strategy'],
    arts: ['music', 'art', 'film', 'design', 'creative', 'culture'],
    education: ['learn', 'study', 'teach', 'course', 'school', 'university']
  };

  analyzeContext(messages: Message[]) {
    if (messages.length < 2) return { 
      shouldChangeTopic: false, 
      suggestedTopics: [], 
      currentContext: 'initial' 
    };

    const recentMessages = messages.slice(-3);
    const currentTopic = this.detectTopic(recentMessages);
    
    if (currentTopic === this.topicAnalysis.currentTopic) {
      this.topicAnalysis.repetitionCount++;
    } else {
      this.topicAnalysis.currentTopic = currentTopic;
      this.topicAnalysis.topicHistory.push(currentTopic);
      this.topicAnalysis.repetitionCount = 0;
    }

    return {
      shouldChangeTopic: this.topicAnalysis.repetitionCount >= 3,
      suggestedTopics: this.getSuggestedTopics(),
      currentContext: this.getCurrentContext(recentMessages)
    };
  }

  private detectTopic(messages: Message[]): string {
    const text = messages.map(m => m.content.toLowerCase()).join(' ');
    
    for (const [topic, keywords] of Object.entries(this.TOPIC_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  private getSuggestedTopics(): string[] {
    const allTopics = Object.keys(this.TOPIC_KEYWORDS);
    return allTopics.filter(topic => !this.topicAnalysis.topicHistory.includes(topic));
  }

  private getCurrentContext(messages: Message[]): string {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes('?')) return 'question';
    if (this.isDefinitionRequest(lastMessage)) return 'definition';
    if (this.isHowToRequest(lastMessage)) return 'howto';
    
    return 'statement';
  }

  private isDefinitionRequest(text: string): boolean {
    return text.includes('what is') || text.includes('define') || text.includes('meaning of');
  }

  private isHowToRequest(text: string): boolean {
    return text.includes('how to') || text.includes('how do i') || text.includes('steps to');
  }
}