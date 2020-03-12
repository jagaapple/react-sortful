export type BaseNodeIdentifier = number | string;

export type Item<NodeIdentifier extends BaseNodeIdentifier> = { identifier: NodeIdentifier; children: Item<NodeIdentifier>[] };
