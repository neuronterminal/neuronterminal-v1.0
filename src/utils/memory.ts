import { Message } from '../types/agent';

export function summarizeContext(messages: Message[]): string {
  return messages
    .slice(-5) // Keep last 5 messages for context
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');
}

export function filterRelevantMemory(messages: Message[], query: string): Message[] {
  return messages.filter(msg => 
    msg.content.toLowerCase().includes(query.toLowerCase())
  );
}