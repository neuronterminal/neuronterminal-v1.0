import React from 'react';
import logo from '../assets/logo.svg';

export function Logo() {
  return (
    <img 
      src={logo} 
      alt="Neuron Interface Logo" 
      className="h-8 w-auto"
      style={{
        filter: 'drop-shadow(0 0 10px rgba(0, 255, 65, 0.5))'
      }}
    />
  );
}