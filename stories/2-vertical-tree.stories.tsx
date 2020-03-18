import { storiesOf } from "@storybook/react";

import { DynamicComponent, StaticComponent } from "./2-vertical-tree";

storiesOf("2 Vertical Tree", module)
  .add("Static", StaticComponent)
  .add("Dynamic", DynamicComponent);
