export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface AgentState {
  context: string[];
  memory: Message[];
  thinking: boolean;
  error: string | null;
}