import * as React from "react";
import { storiesOf } from "@storybook/react";

import { KanbanComponent, TreeComponent } from "./3-advanced-examples";

storiesOf("3 Advanced Examples", module)
  .add("Tree", () => <TreeComponent />)
  .add("Kanban", () => <KanbanComponent />);
