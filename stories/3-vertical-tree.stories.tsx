import * as React from "react";
import { storiesOf } from "@storybook/react";

import { DynamicComponent, DynamicPartialDisabledComponent, StaticComponent } from "./3-tree-vertical";

storiesOf("3 Tree (vertical)", module)
  .add("Static", () => <StaticComponent />)
  .add("Dynamic", () => <DynamicComponent />)
  .add("Dynamic (disabled)", () => <DynamicComponent isDisabled />)
  .add("Dynamic (partial disabled)", () => <DynamicPartialDisabledComponent />);
