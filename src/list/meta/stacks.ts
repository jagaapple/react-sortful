import { ItemIdentifier, NodeMeta } from "../../shared";

export type StackMeta<T extends ItemIdentifier> = Pick<NodeMeta<T>, "identifier" | "groupIdentifier" | "index" | "isGroup"> & {
  nextGroupIdentifier: T | undefined;
};
