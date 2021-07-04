module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'class-methods-use-this': [0],
    'max-len': ['error', { code: 120 }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    'react/prop-types': [1],
    'react/jsx-props-no-spreading': [1],
    // NextJs specific fix: suppress errors for missing 'import React' in files for nextjs
    'react/react-in-jsx-scope': 'off',
    // NextJs specific fix: allow jsx syntax in js files
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], //should add ".ts" if typescript project
    'react/display-name': 1,
    'react/jsx-one-expression-per-line': 'off',

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
