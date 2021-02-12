module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: ['airbnb-typescript', 'prettier', 'prettier/@typescript-eslint'],
}
