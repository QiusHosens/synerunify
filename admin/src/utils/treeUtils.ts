export interface Node {
  id: number;
  parent_id?: number;
  [key: string]: any;
}

/**
 * 获取每个节点的父节点列表
 * @example 
 * 输入：
 * const nodes: Node[] = [
 *  { id: 1, parent_id: undefined },
 *  { id: 2, parent_id: 1 },
 *  { id: 3, parent_id: 2 },
 *  { id: 4, parent_id: 2 },
 *  { id: 5, parent_id: 3 }
 * ];
 * 输出:
 * Node 1 parents: []
 * Node 2 parents: [1]
 * Node 3 parents: [1, 2]
 * Node 4 parents: [1, 2]
 * Node 5 parents: [1, 2, 3]
 * @param nodes 节点列表
 * @returns 
 */
export const getParentNodeLists = (nodes: Node[]): Map<number, Node[]> => {
  // Create a map for quick lookup by id
  const nodeMap = new Map<number, Node>();
  nodes.forEach(node => nodeMap.set(node.id, node));

  // Store result: id -> array of parent nodes
  const parentLists = new Map<number, Node[]>();

  function getParents(node: Node): Node[] {
    // If already computed, return cached result
    if (parentLists.has(node.id)) {
      return parentLists.get(node.id)!;
    }

    const parents: Node[] = [];

    // If node has a parent_id and parent exists in nodeMap
    if (node.parent_id !== undefined && nodeMap.has(node.parent_id)) {
      const parent = nodeMap.get(node.parent_id)!;
      // Recursively get parent's parents first
      parents.push(...getParents(parent));
      // Add immediate parent last
      parents.push(parent);
    }

    // Cache the result
    parentLists.set(node.id, parents);
    return parents;
  }

  // Compute parent list for each node
  nodes.forEach(node => getParents(node));

  return parentLists;
}