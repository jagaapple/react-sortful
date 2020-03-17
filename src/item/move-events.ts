import { ItemIdentifier } from "../shared";

export const checkIsAncestorItem = (
  targetItemIdentifier: ItemIdentifier,
  isGroup: boolean,
  hasItems: boolean,
  ancestorIdentifiersOfChild: ItemIdentifier[],
) => {
  if (!isGroup) return false;
  if (!hasItems) return false;

  const ancestorIdentifiersWithoutTarget = [...ancestorIdentifiersOfChild];
  ancestorIdentifiersWithoutTarget.pop();

  return ancestorIdentifiersWithoutTarget.includes(targetItemIdentifier);
};
