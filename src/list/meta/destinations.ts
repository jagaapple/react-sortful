import { ItemIdentifier } from "../../shared";

export type DestinationMeta<T extends ItemIdentifier> = {
  listIdentifier: T | undefined;
  groupIdentifier: T | undefined;
  index: number | undefined;
};
