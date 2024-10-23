module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"], // Set root to the base directory of your project
          alias: {
            components: "../../superadmin/src/components", // Alias for components
            contexts: "../../superadmin/src/contexts", // Alias for contexts
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // Add other extensions if needed
        },
      ],
    ],
  };
};
