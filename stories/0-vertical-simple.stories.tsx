import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, DynamicPartialDisabledComponent, StaticComponent } from "./0-vertical-simple";

storiesOf("0 Vertical Simple", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />)
  .add("Dynamic (partial disabled)", () => <DynamicPartialDisabledComponent />);
