module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-knobs/register", "@storybook/addon-backgrounds/register", "@storybook/addon-actions/register"],
  webpackFinal: async (config) => {
    // --- TypeScript
    config.resolve.extensions.push(".ts", ".tsx");
    config.module.rules.push({ test: /\.tsx?$/, exclude: /node_modules/, loader: "babel-loader" });

    return config;
  },
};
