import { ItemIdentifier, NodeMeta } from "../../shared";

export type GhostRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
>;
export type DropLineRendererInjectedProps = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};
export type PlaceholderRendererInjectedProps = {
  binder: () => Record<string, any>;
  style: React.CSSProperties;
};
export type PlaceholderRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
>;
export type StackedGroupRendererInjectedProps = {
  binder: () => Record<string, any>;
  style: React.CSSProperties;
};
export type StackedGroupRendererMeta<T extends ItemIdentifier> = Pick<NodeMeta<T>, "identifier" | "groupIdentifier" | "index">;
