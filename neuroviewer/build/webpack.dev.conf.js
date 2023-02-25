'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { merge } = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin }      = require('vue-loader');
//const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
//const portfinder = require('portfinder');
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const options = {
  extensions: [`js`, `vue`],
  exclude: [
    `/node_modules/`,
  ],
  // include: [
  //   `../src/`
  // ]
  context: `/src/`
}

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  module: {
    //rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }) /style loader conflicts
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    // contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    // overlay: config.dev.errorOverlay
    //   ? { warnings: false, errors: true }
    //   : false,
    static: config.dev.assetsPublicPath,
    static: path.resolve(__dirname, 'src/'),
    proxy: config.dev.proxyTable,
    //quiet: true, // necessary for FriendlyErrorsPlugin
    // watchOptions: {
    //   poll: config.dev.poll,
    // }
  },
  plugins: [
    new VueLoaderPlugin(),

    new ESLintPlugin(options),

    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update. //webpack 5 now comes with this plugin out of the box
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.dev.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ])b5n^!sYuM6fP
    
    // new CopyWebpackPlugin({patterns: [{
    //   from: path.resolve(__dirname, '../static'),
    //   to: config.dev.assetsSubDirectory, 
    //   globOptions: { ignore: ['.*'],},},],}),
  ],
  watchOptions: {     //for no file watching size errors
    ignored: ['/docs/', '**/node_modules']
  },
});

// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       // devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//       //   compilationSuccessInfo: {
//       //     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//       //   },
//       //   onErrors: config.dev.notifyOnErrors
//       //   ? utils.createNotifierCallback()
//       //   : undefined
//       // }))

//       resolve(devWebpackConfig)
//     }
//   })
// });

module.exports = devWebpackConfig;