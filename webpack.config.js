/* eslint-disable */

const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public")
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    publicPath: "http://localhost:8090/",
    port: 8090,
    compress: true,
    watchContentBase: true
  }
};
