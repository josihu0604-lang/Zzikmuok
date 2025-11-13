import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import zzikAnalytics from "./.eslint/index.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // DEV/HYGIENE: Console usage rules
  {
    rules: {
      // Only console.warn allowed (for debugging)
      "no-console": ["error", { "allow": ["warn"] }],
      // Prevent unknown props (hydration issues)
      "react/no-unknown-property": "error",
    },
  },
  // Allow console in specific files
  {
    files: ["**/lib/log/*.ts", "**/lib/dev/*.ts", "**/app/api/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  // ZZIK Analytics custom rules
  {
    plugins: {
      "zzik": zzikAnalytics,
    },
    rules: {
      "zzik/no-pii-in-analytics": "error",
    },
  },
]);

export default eslintConfig;
