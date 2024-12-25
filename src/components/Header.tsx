import React from 'react';
import { GitHubButton } from './GitHubButton';

interface HeaderProps {
  isReady: boolean;
}

export function Header({ isReady }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00ff41]">Neuron Interface v1.0</h1>
        <p className="text-sm opacity-70">
          {isReady ? 
            "Neural network initialized. Commence interaction." :
            "Initializing neural pathways..."
          }
        </p>
      </div>
      <GitHubButton />
    </div>
  );
}