module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['./.eslintrc.typescript.js'],
    },
  ],
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    '@react-native',
  ],
  rules: {
    /*
      ESLINT RULES
      https://eslint.org/docs/latest/rules/
    */
    'require-await': 2,
    'prefer-destructuring': ['error', { AssignmentExpression: { array: false } }],
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    indent: [2, 2, { ignoredNodes: ['JSXElement', 'TemplateLiteral'], SwitchCase: 1 }],
    'max-len': [
      'error',
      {
        code: 140,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'max-params': ['error', 3],
    'no-bitwise': 'error',
    'object-curly-spacing': 2,
    'object-shorthand': 'error',
    'max-classes-per-file': ['error', 2],

    /*
      REACT RULES
      https://github.com/jsx-eslint/eslint-plugin-react
    */
    'react/no-string-refs': 2,
    'react/require-default-props': 0,
    'react/style-prop-object': [2, { allow: ['StatusBar'] }],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,

    /*
      IMPORT RULES
      https://github.com/import-js/eslint-plugin-import
    */
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['import', 'jest', 'react', 'react-hooks'],
};
