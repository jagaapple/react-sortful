import { ItemIdentifier, NodeMeta } from "../../shared";

export type GhostRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup" | "listIdentifier"
>;
export type DropLineRendererInjectedProps = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};
export type PlaceholderRendererInjectedProps = { style: React.CSSProperties };
export type PlaceholderRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup" | "listIdentifier"
>;
export type StackedGroupRendererInjectedProps = { style: React.CSSProperties };
export type StackedGroupRendererMeta<T extends ItemIdentifier> = Pick<NodeMeta<T>, "identifier" | "groupIdentifier" | "index">;
