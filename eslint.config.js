import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default tseslint.config(
  includeIgnoreFile(gitignorePath),

  // Base config
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // React
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { react: reactPlugin, "jsx-a11y": jsxA11y },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...jsxA11y.configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
      "import/resolver": { typescript: {} },
    },
  },
  reactHooks.configs.recommended,

  // Import / unused-imports (applied broadly, matching every JS/TS file)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { import: importPlugin, "unused-imports": unusedImports },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "import/no-unresolved": [
        "error",
        { ignore: ["virtual:react-router/server-build"] },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // Typescript (type-aware rules that require @typescript-eslint/parser)
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...importPlugin.configs.typescript.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { fixStyle: "separate-type-imports" },
      ],
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
    },
  },
);
