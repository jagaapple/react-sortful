const path = require("path");

module.exports = {
  stories: ["../stories/**/*.tsx"],
  addons: ["@storybook/addon-knobs/register", "@storybook/addon-backgrounds/register", "@storybook/addon-actions/register"],
  webpackFinal: async (config) => {
    // --- TypeScript
    config.resolve.extensions.push(".ts", ".tsx");
    config.module.rules.push({ test: /\.tsx?$/, exclude: /node_modules/, loader: "babel-loader" });

    // --- CSS
    // Appends "exclude" option to the existing CSS rule in order to ignore default rules for application styles.
    config.module.rules.forEach((rule) => {
      if (rule.test.toString() !== "/\\.css$/") return;

      rule.exclude = path.resolve(process.cwd(), "stories");
    });

    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { modules: true, sourceMap: true, importLoaders: 1 },
        },
      ],
      include: path.resolve(process.cwd(), "stories"),
    });

    return config;
  },
};
