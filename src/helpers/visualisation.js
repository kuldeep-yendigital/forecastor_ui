import map from 'lodash/map';

import Plotly from './Plotly-pack';

const DEFAULT_LAYOUT = {
  autosize: true,
  showlegend: false,
  margin: {
    t: 0,
    r: 0
  },
  hoverlabel: {
    namelength: 100
  },
  xaxis: {
    autorange: true,
    type: 'date'
  }
};

export class Visualisation {

  constructor(opts) {
    this.canvas = opts.canvas;
    this.type = opts.type;
    this.interval = opts.interval;
    this.records = opts.records;
    this.columns = opts.columns;
    this.exportable = opts.exportable;
    this.layout = {
      ...DEFAULT_LAYOUT,
      ...opts.layout
    };
  }

  resize() {
    Plotly.Plots.resize(this.canvas);
  }

  render() {
    let traceOptions = {};
    let chartType = '';
    let layout = { ...this.layout };

    switch (this.type) {
    case 'bar':
      layout.barmode = 'group';
      chartType = 'bar';
      break;
    case 'marker':
      layout.barmode = null;
      chartType = 'scatter';
      traceOptions = {
        mode: 'markers',
        marker: {
          size: 12
        }
      };
      break;
    case 'line':
    default:
      layout.barmode = null;
      chartType = 'scatter';
      break;
    }

    layout.xaxis.tickformat = this.interval === 'yearly' ? '%Y' : '%Y %b';

    this.plots = this.records.map((record) => {
      const datapoints = record.datapoints.map(d => ({
        ...d,
        timestamp: Date.parse(d.month.split('/').reverse().join('/') + ' UTC')
      }));
      datapoints.sort((a, b) => a.timestamp - b.timestamp);

      return Object.assign({}, {
        x: map(datapoints, 'month').map((m) => {
          const [day, month, year] = m.split('/');
          return this.interval === 'yearly' ? `${year}` : `${year}-${month}`;
        }),
        y: map(datapoints, 'value'),
        name: this.columns.map(key => record[key]).join(' | '),
        type: chartType
      }, traceOptions);
    });

    Plotly.newPlot(this.canvas, this.plots, layout, {
      displayModeBar: this.exportable,
      scrollZoom: false
    });
  }

}
