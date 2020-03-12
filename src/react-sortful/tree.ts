import { BaseItemIdentifier, Item } from "./node-identifier";

type TreeNode<ItemIdentifier extends BaseItemIdentifier> = {
  identifier: ItemIdentifier;
  parentItemIdentifier: ItemIdentifier | undefined;
};
type TreeNodeIndicesByIdentifier<ItemIdentifier extends BaseItemIdentifier> = Record<ItemIdentifier, number>;

export class Tree<ItemIdentifier extends BaseItemIdentifier> {
  // ---------------------------------------------------------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------------------------------------------------------
  // Private Variables
  private _nodes: TreeNode<ItemIdentifier>[];
  private _nodeIndicesByIdentifier: TreeNodeIndicesByIdentifier<ItemIdentifier>;

  // ---------------------------------------------------------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  // Public Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  constructor(items: Item<ItemIdentifier>[]) {
    this._nodes = this.convertItemToTree(items);
    this._nodeIndicesByIdentifier = this._nodes.reduce<TreeNodeIndicesByIdentifier<ItemIdentifier>>((object, node, index) => {
      object[node.identifier] = index;

      return object;
    }, {} as any);
  }

  get nodes() {
    return this._nodes;
  }

  getIndexByItemIdentifier(identifier: ItemIdentifier) {
    return this._nodeIndicesByIdentifier[identifier];
  }

  findByItemIdentifier(identifier: ItemIdentifier) {
    const index: number | undefined = this._nodeIndicesByIdentifier[identifier];

    return this._nodes[index];
  }

  // Private Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  private convertItemToTree(items: Item<ItemIdentifier>[], newNodes: TreeNode<ItemIdentifier>[] = []) {
    items.forEach((item) => {
      newNodes.push({ identifier: item.identifier, parentItemIdentifier: undefined });

      if (item.children?.length > 0) this.convertItemToTree(item.children, newNodes);
    });

    return newNodes;
  }
}
