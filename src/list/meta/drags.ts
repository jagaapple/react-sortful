import { ItemIdentifier, NodeMeta } from "../../shared";

export type DragStartMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup" | "listIdentifier"
>;

export type DragEndMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup" | "listIdentifier"
> & {
  nextGroupIdentifier: T | undefined;
  nextIndex: number | undefined;
};
