import React, { useState } from 'react';
import { VoiceControl } from './VoiceControl';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleVoiceInput = (text: string) => {
    setMessage(text);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          placeholder="Enter your message..."
          className="flex-1 bg-transparent border border-[#00ff41] rounded-lg p-3 text-[#00ff41] placeholder-[#00ff41]/50 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/30"
        />
        <VoiceControl
          onSpeechInput={handleVoiceInput}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="matrix-button px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
}