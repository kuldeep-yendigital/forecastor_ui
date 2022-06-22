const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const environment = process.env.environment || 'default';
const outDir = path.resolve(__dirname, 'dist');
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
  devServer: {
    inline: true,
    // To test locally from other devices
    // host: '0.0.0.0',
    port: 9000,
    clientLogLevel: 'none',
    noInfo: false,
    historyApiFallback: {
      rewrites: [
        { from: /^\home$/, to: '/' }
      ]
    },
    stats: {
      // Add asset Information
      assets: true,
      // Sort assets by a field
      assetsSort: 'field',
      // Add information about cached (not built) modules
      cached: false,
      // Add children information
      children: false,
      // Add chunk information (setting this to `false` allows for a less verbose output)
      chunks: false,
      // Add built modules information to chunk information
      chunkModules: false,
      // Add the origins of chunks and chunk merging info
      chunkOrigins: false,
      // Sort the chunks by a field
      chunksSort: 'field',
      // `webpack --colors` equivalent
      colors: true,
      // Add errors
      errors: true,
      // Add details to errors (like resolving log)
      errorDetails: false,
      // Add the hash of the compilation
      hash: false,
      // Add built modules information
      modules: false,
      // Sort the modules by a field
      modulesSort: 'field',
      // Add public path information
      publicPath: false,
      // Add information about the reasons why modules are included
      reasons: false,
      // Add the source code of modules
      source: false,
      // Add timing information
      timings: false,
      // Add webpack version information
      version: false,
      // Add warnings
      warnings: true
    }
  },
  devtool: 'source-map',
  output: {
    path: outDir,
    publicPath: '/',
    filename: '[name].[hash].bundle.js',
    sourceMapFilename: '[name].[hash].bundle.map',
    chunkFilename: '[name].[hash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
    new CleanWebpackPlugin(outDir),
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
    }),
    new CopyWebpackPlugin([
      {
        from: 'favicon.ico',
        to: 'favicon.ico'
      },
      {
        from: `config/${environment}.settings.js`,
        to: 'settings.js'
      },
      {
        from: 'assets',
        to: 'assets'
      },
      {
        from: 'resources/maintenance.html',
        to: 'maintenance.html'
      }
    ]),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'analysis.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'stats.json'
    })
  ]
};

module.exports = config;
