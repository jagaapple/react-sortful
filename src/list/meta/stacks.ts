import { ItemIdentifier, NodeMeta } from "../../shared";

export type StackGroupMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup" | "listIdentifier"
> & {
  nextGroupIdentifier: T | undefined;
};
