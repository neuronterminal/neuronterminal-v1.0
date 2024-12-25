import { KnowledgeGraph } from './knowledgeGraph';

interface Language {
  name: string;
  paradigms: string[];
  features: string[];
  useCases: string[];
  frameworks: string[];
  bestPractices: string[];
}

export class ProgrammingKnowledge {
  private knowledgeGraph: KnowledgeGraph;
  private languages: Map<string, Language> = new Map();

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
    this.initializeKnowledge();
  }

  private initializeKnowledge() {
    // Initialize programming languages knowledge
    const languages: Record<string, Language> = {
      javascript: {
        name: 'JavaScript',
        paradigms: ['object-oriented', 'functional', 'event-driven'],
        features: ['first-class functions', 'prototypal inheritance', 'event loop'],
        useCases: ['web development', 'server-side (Node.js)', 'mobile apps'],
        frameworks: ['React', 'Vue', 'Angular', 'Express', 'Next.js'],
        bestPractices: [
          'Use modern ES6+ features',
          'Implement proper error handling',
          'Follow functional programming principles',
          'Use TypeScript for type safety'
        ]
      },
      python: {
        name: 'Python',
        paradigms: ['object-oriented', 'imperative', 'functional'],
        features: ['dynamic typing', 'list comprehension', 'generators'],
        useCases: ['data science', 'AI/ML', 'web backends', 'automation'],
        frameworks: ['Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch'],
        bestPractices: [
          'Follow PEP 8 style guide',
          'Use virtual environments',
          'Write docstrings',
          'Implement type hints'
        ]
      },
      typescript: {
        name: 'TypeScript',
        paradigms: ['object-oriented', 'functional'],
        features: ['static typing', 'interfaces', 'generics', 'decorators'],
        useCases: ['large-scale applications', 'enterprise software', 'React/Node.js'],
        frameworks: ['Angular', 'NestJS', 'Next.js', 'Deno'],
        bestPractices: [
          'Define strict types',
          'Use interfaces for object shapes',
          'Leverage union types',
          'Enable strict mode'
        ]
      }
    };

    // Add languages to knowledge graph
    Object.entries(languages).forEach(([key, lang]) => {
      this.languages.set(key, lang);
      const langId = this.knowledgeGraph.addNode(lang.name, 'concept', { type: 'language' });

      // Add features
      lang.features.forEach(feature => {
        const featureId = this.knowledgeGraph.addNode(feature, 'concept', { type: 'feature' });
        this.knowledgeGraph.addRelationship(langId, featureId, 'has_feature');
      });

      // Add frameworks
      lang.frameworks.forEach(framework => {
        const frameworkId = this.knowledgeGraph.addNode(framework, 'concept', { type: 'framework' });
        this.knowledgeGraph.addRelationship(langId, frameworkId, 'has_framework');
      });
    });
  }

  getLanguageInfo(language: string): Language | undefined {
    return this.languages.get(language.toLowerCase());
  }

  suggestLanguage(requirements: string[]): string {
    const scores = new Map<string, number>();

    this.languages.forEach((lang, key) => {
      let score = 0;
      requirements.forEach(req => {
        const reqLower = req.toLowerCase();
        if (lang.useCases.some(use => use.toLowerCase().includes(reqLower))) score += 2;
        if (lang.features.some(feature => feature.toLowerCase().includes(reqLower))) score += 1;
        if (lang.frameworks.some(framework => framework.toLowerCase().includes(reqLower))) score += 1;
      });
      scores.set(key, score);
    });

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  getBestPractices(language: string): string[] {
    return this.languages.get(language.toLowerCase())?.bestPractices || [];
  }

  getFrameworks(language: string): string[] {
    return this.languages.get(language.toLowerCase())?.frameworks || [];
  }
}