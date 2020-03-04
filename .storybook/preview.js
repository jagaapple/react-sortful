const React = require("react");
const storybook = require("@storybook/react");

// Configures storybook-addon-knobs.
const { withKnobs } = require("@storybook/addon-knobs");
storybook.addDecorator(withKnobs);

// Configures storybook-addon-backgrounds.
storybook.addParameters({
  backgrounds: [
    { name: "white", value: "#ffffff" },
    { name: "black", value: "#222222" },
    { name: "gray", value: "#a2a2a2" },
  ],
});

// Centering
storybook.addDecorator((story) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <div>{story()}</div>
  </div>
));
