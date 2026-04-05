module.exports = {
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/no-unescaped-entities': 'off',
    'no-portal-imports/no-portal-imports': 'error',
    'no-portal-imports/no-ui-infra-imports': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      plugins: ['no-portal-imports'],
    },
  ],
  ignorePatterns: ['apps/**', 'docs/**'],
};
