import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    // Lint all JS, MJS, CJS files
    files: ["**/*.{js,mjs,cjs}"],

    // Use the recommended JS rules
    plugins: { js },
    extends: ["js/recommended"],

    // Browser globals by default
    languageOptions: { 
      globals: globals.browser, 
    },
    
    rules: {
      semi: ["error", "always"],
    },
  },
  
  // Node-specific files (webpack configs)
  {
    files: ["webpack.*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
]);
