import { Pattern } from '../types';

export function findBestMatch(input: string, patterns: Pattern[]): [Pattern, RegExpMatchArray | null] {
  let bestMatch: [Pattern, RegExpMatchArray | null] | null = null;
  let highestPriority = -1;

  for (const pattern of patterns) {
    const match = input.match(pattern.pattern);
    if (match && (!bestMatch || (pattern.priority || 0) > highestPriority)) {
      bestMatch = [pattern, match];
      highestPriority = pattern.priority || 0;
    }
  }

  return bestMatch || [patterns[patterns.length - 1], null];
}