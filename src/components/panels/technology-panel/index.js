import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { TechnologyStore, EVENTS } from '../../../stores/technologyStore';

export class TechnologyPanel extends DimensionPanel {

  static inject() {
    return [TechnologyStore, EventAggregator];
  }

  constructor(TechnologyStore, EventAggregator) {
    super(TechnologyStore, EventAggregator, 'technology', EVENTS);
  }
}
