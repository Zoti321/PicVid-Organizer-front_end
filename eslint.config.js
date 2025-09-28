
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettier from "eslint-config-prettier";

export default [
  {
    // Global settings for all files
    ignores: ["dist", "node_modules"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  // Vue files configuration
  ...pluginVue.configs["flat/recommended"],
  // Prettier config to disable conflicting rules
  eslintPluginPrettier,
  {
    // Custom rules
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
