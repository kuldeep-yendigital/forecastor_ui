const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const srcDir = path.resolve(__dirname, 'src');
process.env.isDev = process.env.isDev !== undefined ? process.env.isDev : true;

const config = {
  resolve: {
    extensions: ['.js'],
    modules: [srcDir, 'node_modules']
  },
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  },
  mode: 'development',
  entry: {
    app: ['aurelia-bootstrapper']
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      { test: /\.html$/i, loader: 'html-loader' },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        use: 'file-loader?limit=100000&name=images/[name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff&name=styles/fonts/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=styles/fonts/[name].[ext]'
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new AureliaPlugin(),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      isDev: process.env.isDev
    }),

    new HtmlWebpackPlugin({
      template: './callback.ejs',
      isDev: process.env.isDev,
      filename: 'callback.html'
    }),
    new MiniCssPlugin({
      filename: '[name].css'
    })
  ]
};

module.exports = config;
