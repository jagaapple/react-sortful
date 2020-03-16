import * as React from "react";

import { ItemIdentifier } from "./item";
import { ListContext } from "./list.component";

export const GroupContext = React.createContext<{
  identifier: ItemIdentifier | undefined;
}>({ identifier: undefined });

type Props = {
  className?: string;
  identifier: ItemIdentifier;
  index: number;
  children?: React.ReactNode;
};

export const Group = (props: Props) => {
  const listContext = React.useContext(ListContext);

  return (
    <GroupContext.Provider value={{ identifier: props.identifier }}>
      <div className={props.className} style={{ boxSizing: "border-box", margin: `${listContext.groupSpacing}px 0` }}>
        {props.children}
      </div>
    </GroupContext.Provider>
  );
};
