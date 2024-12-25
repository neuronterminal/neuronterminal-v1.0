export class ConceptLearner {
  private concepts: Map<string, Set<string>> = new Map();
  private relationships: Map<string, number> = new Map();

  learnFromInteraction(message: string) {
    const words = message.toLowerCase().split(' ');
    
    // Extract potential concepts (nouns and compound nouns)
    const concepts = this.extractConcepts(words);
    
    // Learn relationships between concepts
    concepts.forEach(concept => {
      if (!this.concepts.has(concept)) {
        this.concepts.set(concept, new Set());
      }
      
      concepts.forEach(otherConcept => {
        if (concept !== otherConcept) {
          this.concepts.get(concept)?.add(otherConcept);
          const relationKey = `${concept}-${otherConcept}`;
          this.relationships.set(
            relationKey,
            (this.relationships.get(relationKey) || 0) + 1
          );
        }
      });
    });
  }

  private extractConcepts(words: string[]): string[] {
    const concepts: string[] = [];
    let currentConcept: string[] = [];

    words.forEach((word, index) => {
      if (this.isCapitalized(word) || this.isNoun(word)) {
        currentConcept.push(word);
      } else if (currentConcept.length > 0) {
        concepts.push(currentConcept.join(' '));
        currentConcept = [];
      }
      
      // Handle end of sentence
      if (index === words.length - 1 && currentConcept.length > 0) {
        concepts.push(currentConcept.join(' '));
      }
    });

    return concepts;
  }

  private isCapitalized(word: string): boolean {
    return /^[A-Z]/.test(word);
  }

  private isNoun(word: string): boolean {
    // Simple heuristic - could be enhanced with proper POS tagging
    return !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to'].includes(word);
  }

  getSimilarConcepts(concept: string): string[] {
    const relatedConcepts = this.concepts.get(concept.toLowerCase());
    if (!relatedConcepts) return [];

    return Array.from(relatedConcepts)
      .sort((a, b) => {
        const scoreA = this.relationships.get(`${concept}-${a}`) || 0;
        const scoreB = this.relationships.get(`${concept}-${b}`) || 0;
        return scoreB - scoreA;
      })
      .slice(0, 3);
  }
}