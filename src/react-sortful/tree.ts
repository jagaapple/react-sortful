import { BaseNodeIdentifier, Item } from "./node-identifier";

type TreeNode<NodeIdentifier extends BaseNodeIdentifier> = {
  identifier: NodeIdentifier;
  parentNodeIdentifier: NodeIdentifier | undefined;
};
type TreeNodeIndicesByIdentifier<NodeIdentifier extends BaseNodeIdentifier> = Record<NodeIdentifier, number>;

export class Tree<NodeIdentifier extends BaseNodeIdentifier> {
  // ---------------------------------------------------------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------------------------------------------------------
  // Private Variables
  private _nodes: TreeNode<NodeIdentifier>[];
  private _nodeIndicesByIdentifier: TreeNodeIndicesByIdentifier<NodeIdentifier>;

  // ---------------------------------------------------------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  // Public Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  constructor(items: Item<NodeIdentifier>[]) {
    this._nodes = this.convertItemToTree(items);
    this._nodeIndicesByIdentifier = this._nodes.reduce<TreeNodeIndicesByIdentifier<NodeIdentifier>>((object, node, index) => {
      object[node.identifier] = index;

      return object;
    }, {} as any);
  }

  get nodes() {
    return this._nodes;
  }

  getIndexByNodeIdentifier(identifier: NodeIdentifier) {
    return this._nodeIndicesByIdentifier[identifier];
  }

  findByNodeIdentifier(identifier: NodeIdentifier) {
    const index: number | undefined = this._nodeIndicesByIdentifier[identifier];

    return this._nodes[index];
  }

  // Private Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  private convertItemToTree(items: Item<NodeIdentifier>[], newNodes: TreeNode<NodeIdentifier>[] = []) {
    items.forEach((item) => {
      newNodes.push({ identifier: item.identifier, parentNodeIdentifier: undefined });

      if (item.children?.length > 0) this.convertItemToTree(item.children, newNodes);
    });

    return newNodes;
  }
}
