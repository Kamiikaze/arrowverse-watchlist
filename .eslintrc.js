module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  rules: {
    "no-plusplus": "warn",
    "no-restricted-syntax": "warn",
    "no-underscore-dangle": "warn",
    "no-await-in-loop": "warn",
    "class-methods-use-this": "warn",
    "linebreak-style": "off",
    "no-restricted-properties": "warn",
    "no-unused-vars": "warn"
  }
}
