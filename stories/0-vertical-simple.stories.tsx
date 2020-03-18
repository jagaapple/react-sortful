import { storiesOf } from "@storybook/react";

import { DynamicComponent, StaticComponent } from "./0-vertical-simple";

storiesOf("0 Vertical Simple", module)
  .add("Static", StaticComponent)
  .add("Dynamic", DynamicComponent);
