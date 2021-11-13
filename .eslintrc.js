module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',

    // This rule is not compatible with typescript-eslint-parser
    // See: https://github.com/eslint/typescript-eslint-parser/issues/437
    'no-undef': 'off',
    // This issue is not compatible with Generic used in .vue file
    // See: https://github.com/typescript-eslint/typescript-eslint/issues/4062
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
  }
}
