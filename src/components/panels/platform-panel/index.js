import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { PlatformStore, EVENTS } from '../../../stores/platformStore';

export class PlatformPanel extends DimensionPanel {

  static inject() {
    return [PlatformStore, EventAggregator];
  }

  constructor(PlatformStore, EventAggregator) {
    super(PlatformStore, EventAggregator, 'platform', EVENTS);
  }
}
