const config = require('./webpack.config.dev.js');
const MiniCssPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

process.env.isDev = false;

// Deactivate source maps
config.devtool = 'nosources-source-map';
config.mode = 'none';

// Activate cache busting
config.output.filename = 'app-bundle-[hash:8].js';

config.module.rules = config.module.rules.map((rule) => {
  // Add hash suffix to images
  if ('file-loader?limit=100000&name=images/[name].[ext]' === rule.use) {
    rule.use = 'file-loader?limit=100000&name=images/[name]-[hash:8].[ext]';
  }

  return rule;
});

config.plugins = config.plugins.map((plugin) => {
  // Add hash suffix to css file
  if (plugin instanceof MiniCssPlugin && '[name].css' === plugin['filename'])
    return new MiniCssPlugin({
      filename: '[name]-[hash:8].css'
    });

  return plugin;
});

config.plugins.push(
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  })
);

module.exports = config;
