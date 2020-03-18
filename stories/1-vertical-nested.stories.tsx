import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, StaticComponent } from "./1-vertical-nested";

storiesOf("1 Vertical Nested", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />);
