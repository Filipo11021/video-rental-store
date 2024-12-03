/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@common/eslint-config/base.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
