module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'class-methods-use-this': 0,
    curly: ['error', 'all'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
        },
        ImportDeclaration: 'never',
        ExportDeclaration: {
          multiline: true,
          minProperties: 2,
        },
      },
    ],
    'no-prototype-builtins': ['off'],
    'no-underscore-dangle': ['off'],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'func-names': ['error', 'never'],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: false,
      },
    ],
    'one-var': ['off'],
    'no-unused-vars': ['error', { args: 'none' }],
  },
};
