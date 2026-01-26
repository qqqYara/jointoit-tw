module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2024: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: 'module'
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  rules: {
    // Add custom rules here
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off'
  }
}
