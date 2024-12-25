import { patterns, Pattern } from './patterns';
import { REFLECTION_PRONOUNS } from './constants';

function preprocess(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .trim();
}

function findMatch(input: string): [Pattern, RegExpMatchArray | null] {
  let bestMatch: [Pattern, RegExpMatchArray | null] | null = null;
  let highestPriority = -1;

  for (const pattern of patterns) {
    const match = input.match(pattern.pattern);
    if (match) {
      const priority = pattern.priority || 0;
      if (priority > highestPriority) {
        bestMatch = [pattern, match];
        highestPriority = priority;
      }
    }
  }

  return bestMatch || [patterns[patterns.length - 1], null];
}

function reflectPronouns(text: string): string {
  let reflected = text.toLowerCase();
  
  // Sort by length (descending) to handle longer phrases first
  const sortedPhrases = Object.keys(REFLECTION_PRONOUNS).sort((a, b) => b.length - a.length);
  
  for (const phrase of sortedPhrases) {
    const replacement = REFLECTION_PRONOUNS[phrase as keyof typeof REFLECTION_PRONOUNS];
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    reflected = reflected.replace(regex, replacement);
  }
  
  return reflected;
}

function transformResponse(response: string, match: RegExpMatchArray | null): string {
  if (!match) return response;

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

export function generateResponse(input: string): string {
  const processedInput = preprocess(input);
  const [pattern, match] = findMatch(processedInput);
  const response = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
  return transformResponse(response, match);
}