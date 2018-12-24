/* create by bailihaha */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const path = require('path')
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const sourceObj = {
  entry: {
    // 'index': './pages/program1/index/src/index.js'
    // 'index': './pages/chatest/src/testLodash.js'
    'index': './src/index2.js'
  },
  // output: {
  //   filename: "bundlenew.js"
  //   // path: path.resolve(__dirname, '../dist')
  // }
}
// 将dist放到js文件的上层
const transfromSource = (source) => {
  let curSource = {
    entry: {},
    output: {}
  }
  let reg = /^\.(.+)\/src\/.+\.js$/
  Object.entries(source.entry)
    .map(([key, val]) => {
      curSource.entry[key] = val
      let matches = val.match(reg)
      if (!matches || !matches[1]) {
        return false
      }
      curSource.output.filename = "bundlenew.js"
      curSource.output.path = path.resolve(__dirname, `.${matches[1]}/dist`)
    })
  // curSource = source
  // console.log(curSource)
  return curSource
}
module.exports = ({
  mode,
  presets
} = {
  mode: "production",
  presets: []
}) => {
  return webpackMerge({
      mode,
      // entry: {
      //   'index': './pages/program1/index/src/index.js'
      // },
      // output: {
      //   filename: "bundle.js",
      //   path: path.resolve(__dirname, '../dist')
      // },
      module: {
        rules: [
          // { test: /\.jpg$/, use: [ "file-loader" ] }
        ]
      },
      plugins: [new HtmlWebpackPlugin({
        // template: './pages/program1/index/index.html'
      }), new webpack.ProgressPlugin()]
    },
    transfromSource(sourceObj),
    modeConfig(mode)
  );
};