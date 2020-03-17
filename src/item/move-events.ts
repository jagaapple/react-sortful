import { ItemIdentifier } from "../shared";

export const checkIsAncestorItem = (
  targetItemIdentifier: ItemIdentifier,
  hasItems: boolean,
  ancestorIdentifiersOfChild: ItemIdentifier[],
) => {
  if (!hasItems) return false;

  const ancestorIdentifiersWithoutTarget = [...ancestorIdentifiersOfChild];
  ancestorIdentifiersWithoutTarget.pop();

  return ancestorIdentifiersWithoutTarget.includes(targetItemIdentifier);
};
