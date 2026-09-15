import js from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";
import importPlugin from "eslint-plugin-import-x";
import promise from "eslint-plugin-promise";
import regexp from "eslint-plugin-regexp";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      "coverage/",
      "reports/",
      ".husky/",
      "docs/",
      "CHANGELOG.md",
      "**/*.cjs",
      "eslint.config.js",
      "lint-staged.config.js",
      "vitest.config.ts",
      "knip.json",
      "commitlint.config.cjs"
    ],
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.mjs", "**/*.mts", "**/*.cjs", "**/*.cts"],
    ...js.configs.recommended,
  },
  ...tseslint.configs.strictTypeChecked.map((config) =>
    config.files ? config : { ...config, files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"] },
  ),
  ...tseslint.configs.stylisticTypeChecked.map((config) =>
    config.files ? config : { ...config, files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"] },
  ),
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      tsdoc,
      unicorn,
      sonarjs,
      security,
      "import-x": importPlugin,
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/unbound-method": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/naming-convention": ["error",
        { selector: "variable", types: ["boolean"], format: ["PascalCase"], prefix: ["is", "has", "should", "can", "was", "did"] },
        { selector: "parameter", types: ["boolean"], format: ["PascalCase"], prefix: ["is", "has", "should", "can", "was", "did"] },
        { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },
        { selector: "variable", format: ["camelCase"] },
        { selector: "parameter", format: ["camelCase"] },
        { selector: "function", format: ["camelCase"] },
        { selector: "method", format: ["camelCase"] },
        { selector: "property", format: ["camelCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase"] },
        { selector: "typeParameter", format: ["PascalCase"], prefix: ["T"] },
        { selector: "default", format: ["camelCase"] },
      ],

      // Unicorn
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-top-level-await": "error",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": ["error", { replacements: {}, allowList: { i: true, j: true } }],

      // SonarJS
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/prefer-immediate-return": "error",

      // Security
      "security/detect-object-injection": "off",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-new-buffer": "error",
      "security/detect-pseudoRandomBytes": "warn",

      // tsdoc
      "tsdoc/syntax": "error",

      // Imports
      "import-x/order": ["error", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      }],
      "import-x/no-duplicates": "error",
      "import-x/no-default-export": "error",
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      verb: {
        // @ts-expect-error -- reuse existing rule to allow error + warn on same selector
        rules: { "naming-convention": tseslint.plugin.rules["naming-convention"] },
      },
    },
    rules: {
      "verb/naming-convention": ["warn", {
        selector: "function",
        format: ["camelCase"],
        custom: { regex: "^(get|create|fetch|update|delete|find|build|parse|format|validate|handle|set|remove|add|is|has|should|can|log).+", match: true },
      }],
    },
  },
  // Test files + test helpers — relax strict type-checked rules for vitest globals
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      parserOptions: {
        project: "tsconfig.test.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/unbound-method": "off",
      "sonarjs/no-duplicate-string": "off",
      "unicorn/filename-case": "off",
      "import-x/no-default-export": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "tests/**/*.ts"],
    plugins: { vitest },
    settings: { vitest: { typecheck: false } },
    languageOptions: {
      globals: vitest.environments.env.globals,
      parserOptions: { project: "tsconfig.test.json", tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(vitest.configs.all.rules).map(([key, value]) => {
          const severity = Array.isArray(value) ? value[0] : value;
          if (severity === "off") return [key, value];
          return [key, Array.isArray(value) ? ["error", ...value.slice(1)] : "error"];
        }),
      ),
    },
  },
  {
    files: ["**/*.ts", "**/*.js"],
    plugins: { promise },
    rules: {
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-nesting": "warn",
      "promise/no-promise-in-callback": "warn",
      "promise/no-callback-in-promise": "warn",
      "promise/no-new-statics": "error",
      "promise/no-return-in-finally": "warn",
      "promise/valid-params": "warn",
      "promise/no-native": "off",
      "promise/avoid-new": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.mjs", "**/*.mts", "**/*.cjs", "**/*.cts"],
    ...regexp.configs["flat/all"],
  },
  eslintConfigPrettier,
  ...markdown.configs.recommended,
  {
    files: ["**/*.md"],
    language: "markdown/gfm",
    languageOptions: { frontmatter: "yaml" },
  },
  {
    files: ["README-template.md", "CONTRIBUTING-template.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "CODE_OF_CONDUCT-template.md", "SECURITY.md", "SECURITY-template.md"],
    rules: {
      "markdown/no-missing-label-refs": "off",
      "markdown/no-missing-link-fragments": "off",
      "markdown/no-multiple-h1": "off",
    },
  },
  {
    files: ["CHANGELOG.md"],
    rules: {
      "markdown/no-missing-label-refs": "off",
    },
  },
);
