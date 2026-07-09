import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Load Airbnb Base and Prettier configs using compatibility layer
  ...compat.extends("eslint-config-airbnb-base", "eslint-config-prettier"),

  {
    files: ["src/**/*.ts", "tests/**/*.ts", "*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      globals: {
        // Node environments
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        // Mocha / Test globals
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    settings: {
      "import/resolver": {
        node: {
          moduleDirectory: ["src", "node_modules"],
        },
        typescript: {},
      },
    },
    rules: {
      "no-underscore-dangle": 0,
      "no-param-reassign": 0,
      "import/no-unresolved": 0,
      "import/extensions": 0,
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": 0,
      "default-param-last": 0,
      "class-methods-use-this": 0,
      "import/prefer-default-export": 0,
      "max-classes-per-file": 0,
      "no-restricted-syntax": 0,
      "no-await-in-loop": 0,
      "max-len": 0,
      "radix": 0,
      "no-restricted-globals": 0,
      "no-use-before-define": 0,
      "no-lonely-if": 0,
      "no-useless-constructor": 0,
      "no-empty-function": 0,
      "no-new": 0,
      "no-promise-executor-return": 0,
      "no-plusplus": 0,
      "no-unused-vars": 0 // Handled by @typescript-eslint/no-unused-vars
    }
  },
  {
    files: ["*.js", "*.mjs"],
    rules: {
      "@typescript-eslint/no-var-requires": 0
    }
  }
];
