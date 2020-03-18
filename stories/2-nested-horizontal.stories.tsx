import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, DynamicPartialDisabledComponent, StaticComponent } from "./2-nested-horizontal";

storiesOf("2 Nested (horizontal)", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />)
  .add("Dynamic (partial disabled)", () => <DynamicPartialDisabledComponent />);
