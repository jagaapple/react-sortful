import * as React from "react";
import { storiesOf } from "@storybook/react";

import { KanbanComponent, LayersPanelComponent, NonStyledComponent, TreeComponent } from "./3-advanced-examples";

storiesOf("3 Advanced Examples", module)
  .add("Non styled", () => <NonStyledComponent />)
  .add("Tree", () => <TreeComponent />)
  .add("Kanban", () => <KanbanComponent />)
  .add("Layers panel", () => <LayersPanelComponent />);
