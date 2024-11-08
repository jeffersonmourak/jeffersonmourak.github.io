module.exports = {
  presets: [
    [
      require("@babel/preset-typescript"),
      // require("@babel/preset-env"),
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
};