import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, DynamicPartialLockedComponent, StaticComponent } from "./1-simple-vertical";

storiesOf("1 Simple (vertical)", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />)
  .add("Dynamic (partial locked)", () => <DynamicPartialLockedComponent />);
