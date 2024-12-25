import nlp from 'compromise';
import { ParsedInput } from '../types/parser';

export function parseInput(text: string): ParsedInput {
  const doc = nlp(text);
  const verbs = doc.verbs().json();
  const statements = doc.sentences().json();
  
  return {
    topics: extractTopics(doc),
    verbs: verbs,
    nouns: doc.nouns().json(),
    sentiment: 0,
    questions: doc.questions().json(),
    statements: statements,
    tense: verbs[0]?.tense || 'present',
    isQuestion: doc.questions().length > 0,
    isNegative: doc.has('#Negative'),
    entities: extractEntities(doc)
  };
}

function extractTopics(doc: any) {
  return doc.topics().json();
}

function extractEntities(doc: any) {
  return [...doc.people().json(), ...doc.places().json()];
}