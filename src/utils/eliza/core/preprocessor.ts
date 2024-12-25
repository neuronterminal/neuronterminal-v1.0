export function preprocessInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .trim();
}

export function normalizeInput(input: string): string {
  const contractions: Record<string, string> = {
    "don't": "do not",
    "can't": "cannot",
    "won't": "will not",
    "i'm": "i am",
    "you're": "you are"
  };

  let normalized = input.toLowerCase();
  Object.entries(contractions).forEach(([contraction, expansion]) => {
    normalized = normalized.replace(new RegExp(contraction, 'g'), expansion);
  });
  
  return normalized;
}