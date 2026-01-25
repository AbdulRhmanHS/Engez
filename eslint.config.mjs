import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier'; // 1. Import it

export default [
  js.configs.recommended, // 2. Use the standard recommended config
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 3. REMOVED the "semi" rule from here!
      // Let Prettier handle the looks.
    },
  },
  {
    files: ['webpack.*.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  eslintConfigPrettier, // 4. ALWAYS put this last to override everything above!
];
