const PRONOUNS = {
  'i am': 'you are',
  'i': 'you',
  'me': 'you',
  'my': 'your',
  'mine': 'yours',
  'you are': 'i am',
  'you': 'i',
  'your': 'my',
  'yours': 'mine'
} as const;

export function reflectPronouns(text: string): string {
  let reflected = text.toLowerCase();
  
  // Sort by length to handle longer phrases first
  const phrases = Object.keys(PRONOUNS).sort((a, b) => b.length - a.length);
  
  for (const phrase of phrases) {
    const replacement = PRONOUNS[phrase as keyof typeof PRONOUNS];
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    reflected = reflected.replace(regex, replacement);
  }
  
  return reflected;
}