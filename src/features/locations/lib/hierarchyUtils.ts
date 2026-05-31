// ── Hierarchy Utility Functions for Location Tree Management ──

import type { LocationNode, TreeNode } from '../types'

/**
 * Build a tree structure from flat array of location nodes
 * @param nodes Flat array of location nodes
 * @param parentId Starting parent ID (null for root nodes)
 * @returns Array of tree nodes with nested children
 */
export function buildLocationTree(
  nodes: LocationNode[],
  parentId: string | null = null
): TreeNode[] {
  const children = nodes.filter(node => node.parentId === parentId);

  return children.map(node => ({
    ...node,
    children: buildLocationTree(nodes, node.id),
    isExpanded: false,
    isSelected: false,
    isFavorite: false,
  }));
}

/**
 * Flatten tree structure back to array
 * @param tree Array of tree nodes
 * @returns Flat array of location nodes
 */
export function flattenTree(tree: TreeNode[]): LocationNode[] {
  const result: LocationNode[] = [];

  function traverse(nodes: TreeNode[]) {
    nodes.forEach(node => {
      const { children, isExpanded, isSelected, isFavorite, ...locationNode } = node;
      result.push(locationNode);
      if (children && children.length > 0) {
        traverse(children);
      }
    });
  }

  traverse(tree);
  return result;
}

/**
 * Get all ancestor nodes of a given location
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Array of ancestor nodes from root to immediate parent
 */
export function getAncestors(nodeId: string, allNodes: LocationNode[]): LocationNode[] {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node || !node.parentId) return [];

  const ancestors: LocationNode[] = [];
  let currentId: string | null = node.parentId;

  while (currentId) {
    const parent = allNodes.find(n => n.id === currentId);
    if (parent) {
      ancestors.unshift(parent);
      currentId = parent.parentId;
    } else {
      break;
    }
  }

  return ancestors;
}

/**
 * Get all descendant nodes of a given location (entire subtree)
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Array of all descendant nodes
 */
export function getDescendants(nodeId: string, allNodes: LocationNode[]): LocationNode[] {
  const descendants: LocationNode[] = [];

  function findChildren(parentId: string) {
    const children = allNodes.filter(n => n.parentId === parentId);
    children.forEach(child => {
      descendants.push(child);
      findChildren(child.id);
    });
  }

  findChildren(nodeId);
  return descendants;
}

/**
 * Get breadcrumb path for a location
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Breadcrumb string (e.g., "Campus A / Building 1 / Floor 2")
 */
export function getLocationPath(nodeId: string, allNodes: LocationNode[]): string {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return '';

  const ancestors = getAncestors(nodeId, allNodes);
  const pathNodes = [...ancestors, node];

  return pathNodes.map(n => n.name).join(' / ');
}

/**
 * Get breadcrumb path as array of nodes
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Array of nodes from root to current location
 */
export function getLocationPathNodes(nodeId: string, allNodes: LocationNode[]): LocationNode[] {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return [];

  const ancestors = getAncestors(nodeId, allNodes);
  return [...ancestors, node];
}

/**
 * Validate if a node can be moved to a new parent
 * @param nodeId Node to move
 * @param newParentId Target parent node ID
 * @param allNodes All location nodes
 * @returns true if move is valid, false otherwise
 */
export function validateHierarchyMove(
  nodeId: string,
  newParentId: string | null,
  allNodes: LocationNode[]
): boolean {
  // Cannot move to self
  if (nodeId === newParentId) return false;

  // Cannot move to own descendant
  if (newParentId) {
    const descendants = getDescendants(nodeId, allNodes);
    if (descendants.some(d => d.id === newParentId)) return false;
  }

  return true;
}

/**
 * Calculate the depth of a location in the hierarchy
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Depth level (0 = root)
 */
export function calculateNodeDepth(nodeId: string, allNodes: LocationNode[]): number {
  return getAncestors(nodeId, allNodes).length;
}

/**
 * Get maximum hierarchy depth for a field office
 * @param fieldOfficeId Field Office ID
 * @param allNodes All location nodes
 * @returns Maximum depth
 */
export function getMaxHierarchyDepth(fieldOfficeId: string, allNodes: LocationNode[]): number {
  const officeNodes = fieldOfficeId === 'all'
    ? allNodes
    : allNodes.filter(n => n.fieldOfficeId === fieldOfficeId);
  if (officeNodes.length === 0) return 0;

  return Math.max(...officeNodes.map(n => n.level));
}

/**
 * Search locations by name or code
 * @param query Search query
 * @param allNodes All location nodes
 * @returns Filtered array of matching nodes
 */
export function searchLocations(query: string, allNodes: LocationNode[]): LocationNode[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return allNodes;

  return allNodes.filter(
    node =>
      node.name.toLowerCase().includes(lowerQuery) ||
      node.code.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get root nodes for a field office
 * @param fieldOfficeId Field Office ID
 * @param allNodes All location nodes
 * @returns Array of root nodes (parentId === null)
 */
export function getRootNodes(fieldOfficeId: string, allNodes: LocationNode[]): LocationNode[] {
  return allNodes.filter(
    n => n.fieldOfficeId === fieldOfficeId && n.parentId === null
  );
}

/**
 * Get immediate children of a location
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Array of direct children
 */
export function getChildren(nodeId: string, allNodes: LocationNode[]): LocationNode[] {
  return allNodes.filter(n => n.parentId === nodeId);
}

/**
 * Count total nodes in a subtree
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns Total count including the node itself
 */
export function countSubtreeNodes(nodeId: string, allNodes: LocationNode[]): number {
  const descendants = getDescendants(nodeId, allNodes);
  return descendants.length + 1; // +1 for the node itself
}

/**
 * Update node path arrays after hierarchy changes
 * @param allNodes All location nodes
 * @returns Updated nodes with correct path arrays
 */
export function updateNodePaths(allNodes: LocationNode[]): LocationNode[] {
  return allNodes.map(node => {
    const ancestors = getAncestors(node.id, allNodes);
    return {
      ...node,
      path: ancestors.map(a => a.id),
      level: ancestors.length,
    };
  });
}

/**
 * Find node by code (codes should be unique)
 * @param code Location code
 * @param allNodes All location nodes
 * @returns Location node or undefined
 */
export function findNodeByCode(code: string, allNodes: LocationNode[]): LocationNode | undefined {
  return allNodes.find(n => n.code === code);
}

/**
 * Check if a location has any descendants
 * @param nodeId Location node ID
 * @param allNodes All location nodes
 * @returns true if has children, false otherwise
 */
export function hasDescendants(nodeId: string, allNodes: LocationNode[]): boolean {
  return allNodes.some(n => n.parentId === nodeId);
}

/**
 * Sort locations by name
 * @param nodes Array of location nodes
 * @param direction Sort direction
 * @returns Sorted array
 */
export function sortLocationsByName(
  nodes: LocationNode[],
  direction: 'asc' | 'desc' = 'asc'
): LocationNode[] {
  return [...nodes].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter locations by status
 * @param nodes Array of location nodes
 * @param status Status filter
 * @returns Filtered array
 */
export function filterLocationsByStatus(
  nodes: LocationNode[],
  status: LocationNode['status']
): LocationNode[] {
  return nodes.filter(n => n.status === status);
}

/**
 * Get location statistics for a field office
 * @param fieldOfficeId Field Office ID
 * @param allNodes All location nodes
 * @returns Statistics object
 */
export function getLocationStatistics(fieldOfficeId: string, allNodes: LocationNode[]) {
  const officeNodes = fieldOfficeId === 'all'
    ? allNodes
    : allNodes.filter(n => n.fieldOfficeId === fieldOfficeId);

  return {
    total: officeNodes.length,
    active: officeNodes.filter(n => n.status === 'active').length,
    inactive: officeNodes.filter(n => n.status === 'inactive').length,
    maintenance: officeNodes.filter(n => n.status === 'maintenance').length,
    planned: officeNodes.filter(n => n.status === 'planned').length,
    totalAssets: officeNodes.reduce((sum, n) => sum + n.assetCount, 0),
    totalUsers: officeNodes.reduce((sum, n) => sum + n.assignedUserCount, 0),
    maxDepth: getMaxHierarchyDepth(fieldOfficeId, allNodes),
    averageDepth: officeNodes.length > 0
      ? officeNodes.reduce((sum, n) => sum + n.level, 0) / officeNodes.length
      : 0,
  };
}
