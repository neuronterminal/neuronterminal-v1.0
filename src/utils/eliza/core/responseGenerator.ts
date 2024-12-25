import { Pattern } from '../types';
import { reflectPronouns } from './reflector';

export function generateResponse(pattern: Pattern, match: RegExpMatchArray | null): string {
  const responses = pattern.responses;
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  if (!match) {
    return selectedResponse;
  }

  return transformResponse(selectedResponse, match);
}

function transformResponse(response: string, match: RegExpMatchArray): string {
  let transformed = response;
  
  for (let i = 1; i < match.length; i++) {
    if (match[i]) {
      const replacement = match[i].trim();
      const reflected = reflectPronouns(replacement);
      transformed = transformed.replace(`%${i}`, reflected);
    }
  }
  
  return transformed;
}