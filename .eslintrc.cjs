/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  
  ],
  ignorePatterns: ["dist/**/*.js"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "unicorn/prevent-abbreviations": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "none",
        "varsIgnorePattern": "^_"
      }
    ],
    "unicorn/filename-case":"off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  root: true,
}
