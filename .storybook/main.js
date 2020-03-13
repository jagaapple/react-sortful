const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-backgrounds", "@storybook/addon-storysource"],
  webpackFinal: async (config) => {
    // --- TypeScript
    config.resolve.extensions.push(".ts", ".tsx");
    config.module.rules.push({ test: /\.tsx?$/, exclude: /node_modules/, loader: "babel-loader" });
    config.module.rules.push({
      test: /\.stories\.tsx?$/,
      exclude: /node_modules/,
      loader: "@storybook/source-loader",
      options: { parser: "typescript" },
      enforce: "pre",
    });

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
