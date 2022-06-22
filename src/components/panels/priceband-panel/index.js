import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { PricebandStore, EVENTS } from '../../../stores/pricebandStore';

export class PricebandPanel extends DimensionPanel {

  static inject() {
    return [PricebandStore, EventAggregator];
  }

  constructor(PricebandStore, EventAggregator) {
    super(PricebandStore, EventAggregator, 'priceband', EVENTS);
  }
}
