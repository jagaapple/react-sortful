export type BaseItemIdentifier = number | string;

export type Item<ItemIdentifier extends BaseItemIdentifier> = { identifier: ItemIdentifier; children: Item<ItemIdentifier>[] };
