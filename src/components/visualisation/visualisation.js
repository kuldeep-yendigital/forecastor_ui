/* global window, document */
import { bindable } from 'aurelia-framework';
import { SelectionStore } from '../../stores/selectionStore';
import { QueryStore } from '../../stores/queryStore';
import { AuthStore } from '../../stores/authStore';
import { GraphStore } from '../../stores/graphStore';
import map from 'lodash/map';
import { Visualisation as VisualisationHelper } from '../../helpers/visualisation';

export class Visualisation {

  static inject() {
    return [GraphStore, SelectionStore, QueryStore, AuthStore];
  }

  constructor(graphStore, selectionStore, queryStore, authStore) {
    this.graphStore = graphStore;
    this.selectionStore = selectionStore;
    this.queryStore = queryStore;
    this.authStore = authStore;

    this.layout = {
      hovermode: 'closest',
      margin: {
        t: 50,
        r: 50
      },
      showlegend: true,
      legend: {
        orientation: 'h'
      },
      barmode: null
    };

    this.plots = [];
    this.resizeEventListener = this.resizePlot.bind(this);
  }

  resizePlot() {
    this.visualisation.resize();
  }

  attached() {
    const windowHeight = window.innerHeight;
    const header = document.querySelector('.tool-name-header');
    const subHeader = document.querySelector('.sub-header');
    let availableHeight = 450;

    if (header && subHeader) {
      availableHeight = windowHeight - (header.offsetHeight + subHeader.offsetHeight);
    }

    const showlegend = (
      this.selectionStore.data.records &&
      this.selectionStore.data.records.length < 10);

    this.layout.height = availableHeight;
    this.layout.showlegend = showlegend;
    this.refreshData();

    this.subscriptions = [
      this.selectionStore.subscribe(this.refreshData.bind(this)),
      this.graphStore.subscribe(this.refreshData.bind(this))
    ];

    window.addEventListener('resize', this.resizeEventListener);
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    window.removeEventListener('resize', this.resizeEventListener);
  }

  refreshData() {
    this.visualisation = new VisualisationHelper({
      canvas: this.canvas,
      type: this.graphStore.data.type,
      interval: this.queryStore.data.range.interval,
      records: this.selectionStore.data.records,
      columns: this.queryStore.data.columnKeys,
      exportable: this.authStore.isExportEnabled(),
      layout: this.layout
    });
    this.visualisation.render();
  }
}
