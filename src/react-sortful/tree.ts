import { NodeIdentifier } from "./node-identifier";

export type TreeNode = { identifier: NodeIdentifier; children: TreeNode[] };
export type Tree = TreeNode[];

type NormalizedTreeNode = { identifier: NodeIdentifier; parentIdentifier: NodeIdentifier | undefined };
type NormalizedTree = NormalizedTreeNode[];

export const normalizeTree = (tree: Tree, normalizedTree: NormalizedTree = []) => {
  tree.forEach((node) => {
    normalizedTree.push({ identifier: node.identifier, parentIdentifier: undefined });

    if (node.children?.length > 0) normalizeTree(node.children, normalizedTree);
  });

  return normalizedTree;
};
