import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { STATES } from './../multi-list-panel';
import * as GLOBAL_EVENTS from '../../../events';
import { MetricIndicatorStore, EVENTS } from '../../../stores/metricIndicatorStore';

export class MetricIndicatorPanel extends DimensionPanel {

  static inject() {
    return [MetricIndicatorStore, EventAggregator];
  }

  constructor(MetricIndicatorStore, EventAggregator) {
    super(MetricIndicatorStore, EventAggregator, 'metricIndicator', EVENTS);
  }

  onItemSelectChange(metricindicator) {
    if(this.isComplex(metricindicator) && metricindicator.state === STATES.CHECKED) {
      this.expandMetric(metricindicator);
    } else {
      super.onItemSelectChange(metricindicator);
    }
  }

  expandMetric(metricindicator) {
    this.publish(GLOBAL_EVENTS.CALCULATED_METRIC_SELECTED);
    super.onItemSelectChange(metricindicator);
  }
}
