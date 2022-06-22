import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { ServicesStore, EVENTS } from '../../../stores/servicesStore';

export class ServicesPanel extends DimensionPanel {

  static inject() {
    return [ServicesStore, EventAggregator];
  }

  constructor(ServicesStore, EventAggregator) {
    super(ServicesStore, EventAggregator, 'services', EVENTS);
  }
}
