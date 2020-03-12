import { BaseItemIdentifier, DestinationMeta as ImportedDestinationMeta, Item as ImportedItem } from "./react-sortful";

export type DestinationMeta<T extends BaseItemIdentifier> = ImportedDestinationMeta<T>;
export type Item<T extends BaseItemIdentifier> = ImportedItem<T>;
export * from "./list.component";
