import * as React from "react";
import { storiesOf } from "@storybook/react";

import {
  CustomDragHandleComponent,
  KanbanComponent,
  LayersPanelComponent,
  NonStyledComponent,
  TreeComponent,
} from "./3-advanced-examples";

storiesOf("3 Advanced Examples", module)
  .add("Non styled", () => <NonStyledComponent />)
  .add("Custom drag handle", () => <CustomDragHandleComponent />)
  .add("Tree", () => <TreeComponent />)
  .add("Kanban", () => <KanbanComponent />)
  .add("Layers panel", () => <LayersPanelComponent />);
