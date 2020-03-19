import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, DynamicPartialLockedComponent, StaticComponent } from "./2-nested-horizontal";

storiesOf("2 Nested (horizontal)", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />)
  .add("Dynamic (partial locked)", () => <DynamicPartialLockedComponent />);
