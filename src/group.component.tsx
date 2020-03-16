import * as React from "react";

import { ItemIdentifier } from "./item";
import { ListContext } from "./list.component";

export const GroupContext = React.createContext<{
  identifier: ItemIdentifier | undefined;
}>({ identifier: undefined });

type Props<T extends ItemIdentifier> = {
  className?: string;
  identifier: T;
  index: number;
  children?: React.ReactNode;
};

export const Group = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);

  return (
    <GroupContext.Provider value={{ identifier: props.identifier }}>
      <div className={props.className} style={{ boxSizing: "border-box", margin: `${listContext.itemSpacing}px 0` }}>
        {props.children}
      </div>
    </GroupContext.Provider>
  );
};
