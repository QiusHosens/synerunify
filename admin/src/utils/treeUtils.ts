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

interface TreeNode {
  id: string;
  children: TreeNode[];
}

/**
 * 获取选中或半选中节点id列表
 * @example
 * const tree: TreeNode[] = [
 *   {
 *     id: '1',
 *     label: 'Root 1',
 *     children: [
 *       {
 *         id: '2',
 *         label: 'Child 1',
 *         children: [{ id: '4', label: 'Grandchild 1', children: [] }],
 *       },
 *     ],
 *   },
 *   {
 *     id: '3',
 *     label: 'Root 2',
 *     children: [],
 *   },
 * ];
 * 
 * console.log(getSelectedIds(['2', '4'], tree)); // ['1', '2', '4']
 * console.log(getSelectedIds(['3'], tree)); // ['3']
 * console.log(getSelectedIds([], tree)); // []
 * 
 * @param selectedId 选中节点
 * @param tree 树
 * @returns 
 */
export const getSelectedIds = (selectedId: string[], tree: TreeNode[]): string[] => {
  const result: string[] = [];

  // 辅助函数：递归检查节点状态
  const checkNode = (node: TreeNode): 'selected' | 'half-selected' | 'unselected' => {
    const isNodeSelected = selectedId.includes(node.id);
    
    if (!node.children || node.children.length === 0) {
      return isNodeSelected ? 'selected' : 'unselected';
    }

    let allSelected = true;
    let anySelected = false;

    for (const child of node.children) {
      const childStatus = checkNode(child);
      if (childStatus === 'selected') {
        anySelected = true;
      } else if (childStatus === 'half-selected') {
        anySelected = true;
        allSelected = false;
      } else {
        allSelected = false;
      }
    }

    if (isNodeSelected) {
      return allSelected ? 'selected' : 'half-selected';
    }
    return anySelected ? 'half-selected' : 'unselected';
  };

  // 遍历树，收集选中或半选的节点ID
  const collectSelectedIds = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      const status = checkNode(node);
      if (status === 'selected' || status === 'half-selected') {
        result.push(node.id);
      }
      if (node.children && node.children.length > 0) {
        collectSelectedIds(node.children);
      }
    }
  };

  collectSelectedIds(tree);
  return result;
};

// 区域树相关接口
interface AreaNode {
  id: number;
  name: string;
  children?: AreaNode[];
}

/**
 * 根据区域ID查找从根节点到目标节点的完整路径
 * @param areaTree 区域树
 * @param targetId 目标区域ID
 * @returns 路径数组，包含从根到目标节点的所有ID
 */
export const findAreaPathById = (areaTree: AreaNode[], targetId: number): string[] => {
  const path: string[] = [];
  
  const findPath = (nodes: AreaNode[], currentPath: string[]): boolean => {
    for (const node of nodes) {
      const newPath = [...currentPath, String(node.id)];
      
      if (node.id === targetId) {
        path.push(...newPath);
        return true;
      }
      
      if (node.children && node.children.length > 0) {
        if (findPath(node.children, newPath)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findPath(areaTree, []);
  return path;
};

/**
 * 根据区域ID查找对应的区域节点
 * @param areaTree 区域树
 * @param targetId 目标区域ID
 * @returns 找到的区域节点，未找到返回null
 */
export const findAreaNodeById = (areaTree: AreaNode[], targetId: number): AreaNode | null => {
  for (const node of areaTree) {
    if (node.id === targetId) {
      return node;
    }
    
    if (node.children && node.children.length > 0) {
      const found = findAreaNodeById(node.children, targetId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};