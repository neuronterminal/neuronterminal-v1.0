import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../utils/eliza/types';
import { preprocessInput } from '../utils/eliza/core/preprocessor';
import { findBestMatch } from '../utils/eliza/core/matcher';
import { generateResponse } from '../utils/eliza/core/responseGenerator';
import { patterns } from '../utils/eliza/patterns';

export function useEliza() {
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: uuidv4(),
    role: 'agent',
    content: "Hello. How are you feeling today?",
    timestamp: new Date()
  }]);

  const processMessage = useCallback((userMessage: string) => {
    const processedInput = preprocessInput(userMessage);
    const [pattern, match] = findBestMatch(processedInput, patterns);
    const response = generateResponse(pattern, match);

    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    const elizaResponse: Message = {
      id: uuidv4(),
      role: 'agent',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage, elizaResponse]);
    return elizaResponse;
  }, []);

  return {
    messages,
    processMessage
  };
}