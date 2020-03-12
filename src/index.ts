import { BaseNodeIdentifier, DestinationMeta as ImportedDestinationMeta, Item as ImportedItem } from "./react-sortful";

export type DestinationMeta<T extends BaseNodeIdentifier> = ImportedDestinationMeta<T>;
export type Item<T extends BaseNodeIdentifier> = ImportedItem<T>;
export * from "./react-sortful.component";
