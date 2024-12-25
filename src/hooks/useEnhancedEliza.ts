import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types/agent';
import { ContextAnalyzer } from '../utils/nlp/contextAnalyzer';
import { IntentRecognizer } from '../utils/nlp/intentRecognition';
import { MemoryNetwork } from '../utils/nlp/memoryNetwork';
import { ReasoningEngine } from '../utils/nlp/reasoningEngine';
import { ConceptLearner } from '../utils/nlp/conceptLearner';
import { ProgrammingKnowledge } from '../utils/nlp/programmingKnowledge';
import { CodeExplainer } from '../utils/nlp/codeExplainer';
import { loadModel } from '../utils/ml/encoder';

export function useEnhancedEliza() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextAnalyzer] = useState(() => new ContextAnalyzer());
  const [intentRecognizer] = useState(() => new IntentRecognizer());
  const [memoryNetwork] = useState(() => new MemoryNetwork());
  const [reasoningEngine] = useState(() => new ReasoningEngine());
  const [conceptLearner] = useState(() => new ConceptLearner());
  const [programmingKnowledge] = useState(() => new ProgrammingKnowledge());
  const [codeExplainer] = useState(() => new CodeExplainer());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadModel().then(() => {
      setIsReady(true);
      const initial: Message = {
        id: uuidv4(),
        role: 'agent',
        content: "Hello! I'm your AI assistant with expertise in programming and technology. I can help explain concepts, analyze code, suggest best practices, and discuss various topics. What would you like to explore?",
        timestamp: new Date()
      };
      setMessages([initial]);
      memoryNetwork.addMemory(initial);
    });
  }, []);

  const processMessage = useCallback(async (userMessage: string) => {
    if (!isReady) return;

    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    // Learn from user input
    conceptLearner.learnFromInteraction(userMessage);
    
    // Analyze intent and context
    const intent = intentRecognizer.analyze(userMessage);
    const context = contextAnalyzer.analyzeContext([...messages, newUserMessage]);
    
    // Check for code-related queries
    const codeMatch = userMessage.match(/```(\w+)?\s*([\s\S]+?)```/);
    let response: string;

    if (codeMatch) {
      const [, language = 'javascript', code] = codeMatch;
      const explanation = codeExplainer.explainCode(code, language);
      const suggestions = codeExplainer.suggestImprovement(code, language);
      const practices = programmingKnowledge.getBestPractices(language);
      
      response = `${explanation}\n\n${suggestions}\n\nBest practices for ${language}:\n${practices.map(p => `• ${p}`).join('\n')}`;
    } else {
      // Get relevant memories and generate response
      const relevantMemories = memoryNetwork.getRelevantMemories(userMessage);
      response = await reasoningEngine.generateResponse(intent, userMessage);
      
      // Add related concepts if available
      const similarConcepts = conceptLearner.getSimilarConcepts(userMessage);
      if (similarConcepts.length > 0) {
        response += `\n\nRelated topics you might be interested in: ${similarConcepts.join(', ')}`;
      }
    }

    const agentMessage: Message = {
      id: uuidv4(),
      role: 'agent',
      content: response,
      timestamp: new Date()
    };

    memoryNetwork.addMemory(newUserMessage);
    memoryNetwork.addMemory(agentMessage);
    
    setMessages(prev => [...prev, newUserMessage, agentMessage]);
    return agentMessage;
  }, [isReady, messages, contextAnalyzer, intentRecognizer, memoryNetwork, reasoningEngine, conceptLearner, programmingKnowledge, codeExplainer]);

  return { messages, processMessage, isReady };
}