import { ItemIdentifier } from "../../shared";

export type DestinationMeta<T extends ItemIdentifier> = {
  groupIdentifier: T | undefined;
  index: number | undefined;
};
