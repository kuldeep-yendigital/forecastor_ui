import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { MetricStore, EVENTS } from '../../../stores/metricStore';
import { STATES } from './../multi-list-panel';

export class MetricPanel extends DimensionPanel {

  static inject() {
    return [MetricStore, EventAggregator];
  }

  constructor(MetricStore, EventAggregator) {
    super(MetricStore, EventAggregator, 'metric', EVENTS);
  }
}
