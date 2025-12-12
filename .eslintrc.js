module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  parser: '@typescript-eslint/parser',
  rules: {
    'ft-flow/define-flow-type': 'off',
    'object-curly-spacing': ['error', 'never'],
  },
};
