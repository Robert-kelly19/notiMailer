// ESLint Flat Config (ESLint v9+) – CommonJS version

const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const next = require("@next/eslint-plugin-next");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules", "dist", ".next"],
  },

  // Base JS/TS
  ...tseslint.config({
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "off", // 🔥 Fixes React not defined
    },
  }),

  // Next.js config (apps/web + shared React code)
  {
    files: [
      "apps/web/**/*.{js,jsx,ts,tsx}",
      "packages/**/*.{js,jsx,ts,tsx}",
      "apps/docs/**/*.{js,jsx,ts,tsx}", // your docs app folder
    ],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@next/next": next,
    },
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,

      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,

      // 🔥 Fix: You have no /pages directory
      "@next/next/no-html-link-for-pages": "off",

      "react/react-in-jsx-scope": "off",
      "no-undef": "off", // Important for React 17+ JSX
    },
  },

  // Node backend (apps/api)
  {
    files: ["apps/api/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-var": "error",
      "prefer-template": "error",
    },
  },

  // Config files (like prettier.config.js)
  {
    files: ["**/*.config.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-undef": "off",
    },
  },

  // Jest tests
  {
    files: ["**/*.{test,spec}.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
