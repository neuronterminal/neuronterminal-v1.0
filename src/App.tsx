import React from 'react';
import { useEnhancedEliza } from './hooks/useEnhancedEliza';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MatrixBackground } from './components/MatrixBackground';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';

export function App() {
  const { messages, processMessage, isReady } = useEnhancedEliza();

  return (
    <>
      <MatrixBackground />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <ChatContainer>
          <Header isReady={isReady} />
          <div className="h-[400px] overflow-y-auto mb-6 custom-scrollbar">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
          <ChatInput 
            onSend={processMessage}
            disabled={!isReady}
          />
        </ChatContainer>
      </div>
    </>
  );
}

export default App;