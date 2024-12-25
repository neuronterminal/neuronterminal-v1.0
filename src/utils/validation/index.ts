// Add input validation
export const validateInput = (input: string): boolean => {
  if (!input || input.trim().length === 0) return false;
  if (input.length > 1000) return false;
  return true;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000);
};