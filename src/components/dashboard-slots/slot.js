import { bindable, bindingMode } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { EVENTS as DASHBOARD_EVENTS } from '../../stores/dashboardStore';
import { Visualisation } from '../../helpers/visualisation';

require('./slot.scss');

export class DashboardSlot {
  @bindable index;
  @bindable item;
  @bindable exportable;

  static inject() {
    return [EventAggregator];
  }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.plots = [];
    this.resizeListener = this.resize.bind(this);
  }

  attached() {
    window.addEventListener('resize', this.resizeListener);
    this.renderPlotly();
  }

  detached() {
    window.removeEventListener('resize', this.resizeListener);
  }

  resize() {
    this.visualisation.resize();
  }

  renderPlotly() {
    this.visualisation = new Visualisation({
      canvas: this.canvas,
      type: this.item.graph.type,
      interval: this.item.graph.query.range.interval,
      records: this.item.graph.records,
      columns: this.item.graph.query.columnKeys,
      exportable: this.exportable,
      layout: {
        height: this.canvas.clientHeight
      }
    });
    this.visualisation.render();
  }

  delete() {
    this.eventAggregator.publish(DASHBOARD_EVENTS.DELETE_SLOT, { index: this.index });
  }
}
