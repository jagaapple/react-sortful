import * as React from "react";
import { storiesOf } from "@storybook/react";

import { SampleComponent } from "./sample.component";

storiesOf("Sample/Sample", module).add("Default", () => <SampleComponent />);
