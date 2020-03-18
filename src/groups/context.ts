import * as React from "react";

import { ItemIdentifier } from "../shared";

export const Context = React.createContext<{
  identifier: ItemIdentifier | undefined;
  ancestorIdentifiers: ItemIdentifier[];
  childIdentifiersRef: React.MutableRefObject<Set<ItemIdentifier>>;
}>({ identifier: undefined, ancestorIdentifiers: [], childIdentifiersRef: { current: new Set() } });
