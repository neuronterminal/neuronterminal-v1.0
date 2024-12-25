import { v4 as uuidv4 } from 'uuid';

interface KnowledgeNode {
  id: string;
  concept: string;
  type: 'entity' | 'concept' | 'fact' | 'relation';
  properties: Record<string, any>;
  connections: Set<string>;
  confidence: number;
}

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private relationships: Map<string, Set<string>> = new Map();

  addNode(concept: string, type: KnowledgeNode['type'], properties: Record<string, any> = {}) {
    const id = uuidv4();
    const node: KnowledgeNode = {
      id,
      concept,
      type,
      properties,
      connections: new Set(),
      confidence: 0.5
    };
    this.nodes.set(id, node);
    return id;
  }

  addRelationship(sourceId: string, targetId: string, type: string) {
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
      related.add(node);

      for (const connectionId of node.connections) {
        const connectedNode = this.nodes.get(connectionId);
        if (connectedNode && !visited.has(connectionId)) {
          queue.push([connectedNode, currentDepth + 1]);
        }
      }
    }

    return Array.from(related);
  }

  inferNewKnowledge(): void {
    // Transitive inference
    this.nodes.forEach(node => {
      node.connections.forEach(connId1 => {
        const conn1 = this.nodes.get(connId1);
        if (conn1) {
          conn1.connections.forEach(connId2 => {
            if (!node.connections.has(connId2) && connId2 !== node.id) {
              this.addRelationship(node.id, connId2, 'inferred');
              node.confidence *= 0.8; // Reduce confidence for inferred relationships
            }
          });
        }
      });
    });
  }
}