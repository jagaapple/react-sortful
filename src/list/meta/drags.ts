import { ItemIdentifier, NodeMeta } from "../../shared";

export type DragStartMeta<T extends ItemIdentifier> = Pick<NodeMeta<T>, "identifier" | "groupIdentifier" | "index" | "isGroup">;
export type DragEndMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
> & {
  nextGroupIdentifier: T | undefined;
  nextIndex: number | undefined;
};
