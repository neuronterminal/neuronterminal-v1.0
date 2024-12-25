import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, AgentState } from '../types/agent';
import { summarizeContext, filterRelevantMemory } from '../utils/memory';
import { generateResponse, ResponseMode } from '../utils/agent/responseGenerator';
import { AnthropicClientError } from '../utils/anthropic/errors';

const initialState: AgentState = {
  context: [],
  memory: [],
  thinking: false,
  error: null
};

export function useAgent(mode: ResponseMode = 'claude') {
  const [state, setState] = useState<AgentState>(initialState);

  const processMessage = useCallback(async (userMessage: string) => {
    setState(prev => ({ ...prev, thinking: true, error: null }));

    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    try {
      const response = await generateResponse(userMessage, mode);
      
      const agentMessage: Message = {
        id: uuidv4(),
        role: 'agent',
        content: response,
        timestamp: new Date()
      };

      setState(prev => ({
        context: [...prev.context, summarizeContext([...prev.memory, newUserMessage])],
        memory: [...prev.memory, newUserMessage, agentMessage],
        thinking: false,
        error: null
      }));

      return agentMessage;
    } catch (error) {
      const errorMessage = error instanceof AnthropicClientError 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';

      const errorResponse: Message = {
        id: uuidv4(),
        role: 'agent',
        content: errorMessage,
        timestamp: new Date(),
        error: true
      };

      setState(prev => ({
        ...prev,
        memory: [...prev.memory, newUserMessage, errorResponse],
        thinking: false,
        error: errorMessage
      }));
    }
  }, [mode]);

  const searchMemory = useCallback((query: string) => {
    return filterRelevantMemory(state.memory, query);
  }, [state.memory]);

  return {
    state,
    processMessage,
    searchMemory
  };
}