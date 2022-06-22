import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { BillingTypeStore, EVENTS } from '../../../stores/billingTypeStore';

export class BillingTypePanel extends DimensionPanel {

  static inject() {
    return [BillingTypeStore, EventAggregator];
  }

  constructor(BillingTypeStore, EventAggregator) {
    super(BillingTypeStore, EventAggregator, 'billingType', EVENTS);
  }
}
