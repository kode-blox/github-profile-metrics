import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  eslintConfigPrettier,
]);
