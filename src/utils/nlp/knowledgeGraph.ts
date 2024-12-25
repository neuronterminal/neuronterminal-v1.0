import { v4 as uuidv4 } from 'uuid';
import { KnowledgeNode } from './types';

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private relationships: Map<string, Set<string>> = new Map();

  addNode(concept: string, type: KnowledgeNode['type'], properties: Record<string, any> = {}): string {
    const id = uuidv4();
    const node: KnowledgeNode = {
      id,
      concept,
      type,
      properties,
      connections: new Set(),
      confidence: 0.5,
      relevance: 1.0
    };
    this.nodes.set(id, node);
    return id;
  }

  addRelationship(sourceId: string, targetId: string, type: string): void {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (source && target) {
      source.connections.add(targetId);
      target.connections.add(sourceId);
      
      if (!this.relationships.has(type)) {
        this.relationships.set(type, new Set());
      }
      this.relationships.get(type)?.add(`${sourceId}-${targetId}`);
    }
  }

  findRelatedConcepts(concept: string, depth: number = 2): KnowledgeNode[] {
    const conceptNode = Array.from(this.nodes.values())
      .find(node => node.concept.toLowerCase() === concept.toLowerCase());
    
    if (!conceptNode) return [];

    const related = new Set<KnowledgeNode>();
    const queue = [[conceptNode, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [node, currentDepth] = queue.shift() as [KnowledgeNode, number];
      
      if (currentDepth > depth) continue;
      
      visited.add(node.id);
      node.relevance = 1 - (currentDepth / depth);
      related.add(node);

      for (const connectionId of node.connections) {
        const connectedNode = this.nodes.get(connectionId);
        if (connectedNode && !visited.has(connectionId)) {
          queue.push([connectedNode, currentDepth + 1]);
        }
      }
    }

    return Array.from(related)
      .sort((a, b) => b.relevance - a.relevance);
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  getRelationships(type?: string): string[] {
    if (type) {
      return Array.from(this.relationships.get(type) || []);
    }
    return Array.from(this.relationships.values())
      .flatMap(set => Array.from(set));
  }
}
