import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { GeographyStore, EVENTS } from '../../../stores/geographyStore';

export class GeographyPanel extends DimensionPanel {

  static inject() {
    return [GeographyStore, EventAggregator];
  }

  constructor(GeographyStore, EventAggregator) {
    super(GeographyStore, EventAggregator, 'geography', EVENTS);
  }
}
