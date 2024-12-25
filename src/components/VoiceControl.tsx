import React from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface VoiceControlProps {
  onSpeechInput: (text: string) => void;
  disabled?: boolean;
}

export function VoiceControl({ onSpeechInput, disabled }: VoiceControlProps) {
  const { isListening, speechSupported, startListening } = useSpeech();

  const handleVoiceInput = () => {
    const recognition = startListening();
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onSpeechInput(text);
    };

    recognition.start();
  };

  if (!speechSupported) return null;

  return (
    <button
      onClick={handleVoiceInput}
      disabled={disabled || isListening}
      className="p-2 rounded-full matrix-button hover:bg-[#00ff41]/10 disabled:opacity-50 transition-all duration-300"
      title={isListening ? 'Listening...' : 'Click to speak'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#00ff41]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
}