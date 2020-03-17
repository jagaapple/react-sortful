import { ItemIdentifier, NodeMeta } from "../../shared";

export type GhostRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
>;
export type DropLineRendererInjectedProps = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};
