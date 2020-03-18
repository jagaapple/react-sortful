import { ItemIdentifier } from "../shared";

export const checkIsAncestorItem = (targetItemIdentifier: ItemIdentifier, ancestorIdentifiersOfChild: ItemIdentifier[]) => {
  const ancestorIdentifiersWithoutTarget = [...ancestorIdentifiersOfChild];
  ancestorIdentifiersWithoutTarget.pop();

  return ancestorIdentifiersWithoutTarget.includes(targetItemIdentifier);
};
