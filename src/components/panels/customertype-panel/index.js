import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { CustomerTypeStore, EVENTS } from '../../../stores/customerTypeStore';

export class CustomerTypePanel extends DimensionPanel {

  static inject() {
    return [CustomerTypeStore, EventAggregator];
  }

  constructor(CustomerTypeStore, EventAggregator) {
    super(CustomerTypeStore, EventAggregator, 'customertype', EVENTS);
  }
}
