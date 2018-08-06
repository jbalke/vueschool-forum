// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  //parser: "babel-eslint",
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: 6
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: ["standard", "plugin:vue/essential"],
  // required to lint *.vue files
  //plugins: ['html'],
  plugins: ["vue"], // enable vue plugin
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-unused-vars": process.env.NODE_ENV === "production" ? 2 : 1,
    "prettier/prettier": 0,
    quotes: 0,
    semi: 0,
    "space-before-function-paren": 0,
    indent: 0
  }
};
