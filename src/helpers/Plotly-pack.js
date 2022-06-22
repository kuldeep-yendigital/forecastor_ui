const Plotly = require('plotly.js/lib/core');
const Bar = require('plotly.js/lib/bar');
const Scatter = require('plotly.js/lib/scatter');

Plotly.register([
  Bar, Scatter
]);

module.exports = Plotly;
