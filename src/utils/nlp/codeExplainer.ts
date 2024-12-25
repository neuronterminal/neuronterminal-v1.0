export class CodeExplainer {
  private static readonly PATTERNS = {
    javascript: {
      'async/await': /async\s+function|\bawait\b/,
      'arrow function': /\([^)]*\)\s*=>\s*{/,
      'destructuring': /(?:const|let|var)\s*{[^}]+}\s*=/,
      'promise': /new\s+Promise|\.then\(|\.catch\(/
    },
    python: {
      'list comprehension': /\[[^\]]+\s+for\s+[^\]]+\]/,
      'decorator': /@\w+/,
      'async/await': /async\s+def|\bawait\b/,
      'type hints': /def\s+\w+\([^)]*:\s*\w+[^)]*\)/
    },
    typescript: {
      'interface': /interface\s+\w+/,
      'type': /type\s+\w+\s*=/,
      'generic': /<[^>]+>/,
      'decorator': /@\w+/
    }
  };

  explainCode(code: string, language: string): string {
    const patterns = CodeExplainer.PATTERNS[language as keyof typeof CodeExplainer.PATTERNS];
    if (!patterns) return "I can't explain code in this language yet.";

    const features = Object.entries(patterns)
      .filter(([, pattern]) => pattern.test(code))
      .map(([feature]) => feature);

    if (features.length === 0) {
      return "This appears to be simple code without advanced features.";
    }

    return `This code uses the following features:\n${features.map(f => `- ${f}`).join('\n')}`;
  }

  suggestImprovement(code: string, language: string): string {
    // Add code improvement suggestions based on language best practices
    const suggestions: string[] = [];

    if (language === 'javascript' || language === 'typescript') {
      if (code.includes('var ')) {
        suggestions.push('Consider using const or let instead of var');
      }
      if (!code.includes('try') && (code.includes('await') || code.includes('Promise'))) {
        suggestions.push('Add error handling with try/catch for async operations');
      }
    }

    if (language === 'python') {
      if (!code.includes('def ')) {
        suggestions.push('Consider organizing code into functions for better reusability');
      }
      if (code.includes('except:')) {
        suggestions.push('Specify exception types instead of using bare except');
      }
    }

    return suggestions.length > 0
      ? `Suggestions for improvement:\n${suggestions.join('\n')}`
      : 'No immediate improvements suggested.';
  }
}