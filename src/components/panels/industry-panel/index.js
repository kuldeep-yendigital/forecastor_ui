import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { IndustryStore, EVENTS } from '../../../stores/industryStore';

export class IndustryPanel extends DimensionPanel {

  static inject() {
    return [IndustryStore, EventAggregator];
  }

  constructor(IndustryStore, EventAggregator) {
    super(IndustryStore, EventAggregator, 'industry', EVENTS);
  }
}
