import * as React from "react";

import { ItemIdentifier } from "../shared";

export const Context = React.createContext<{
  identifier: ItemIdentifier | undefined;
  ancestorIdentifiers: ItemIdentifier[];
  hasNoItems: boolean;
}>({ identifier: undefined, ancestorIdentifiers: [], hasNoItems: false });
