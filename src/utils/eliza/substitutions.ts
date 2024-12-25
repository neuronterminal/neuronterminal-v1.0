export const substitutions: [RegExp, string][] = [
  [/\b(I am|I'm)\b/g, "you are"],
  [/\bI\b/g, "you"],
  [/\bme\b/g, "you"],
  [/\bmy\b/g, "your"],
  [/\byou are\b/g, "I am"],
  [/\byou\b/g, "I"],
  [/\byour\b/g, "my"]
];