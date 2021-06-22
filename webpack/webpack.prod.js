const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.dev_and_prod.js');

const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.resolve(ROOT_DIR, 'app');

const config = {
  mode: 'production',
  devtool: 'source-map',
  performance: { hints: false },

  entry: [
    'babel-polyfill',
    `${APP_DIR}/index.tsx`,
  ],

  output: {
    globalObject: 'this',
    filename: '[name].[contenthash].js',
    chunkFilename: '[id].[chunkhash].chunk.js',
    path: path.resolve(__dirname, '../dist/public'),
    publicPath: '/public/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      favicon: path.join(ROOT_DIR, 'favicon.ico'),
      template: path.join(ROOT_DIR, 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style_[chunkhash].css',
      ignoreOrder: true,
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false,
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },

  stats: {
    children: false,
  },
};

module.exports = merge(commonDevAndProd, config);
