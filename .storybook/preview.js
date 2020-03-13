const React = require("react");
const storybook = require("@storybook/react");

// Configures storybook-addon-backgrounds.
storybook.addParameters({
  backgrounds: [
    { name: "default", value: "#f6f9fc", default: true },
    { name: "white", value: "#ffffff" },
    { name: "black", value: "#222222" },
  ],
});

// Centering
storybook.addDecorator((story) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <div>{story()}</div>
  </div>
));
