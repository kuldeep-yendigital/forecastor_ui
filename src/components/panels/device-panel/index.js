import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { DeviceStore, EVENTS } from '../../../stores/deviceStore';

export class DevicePanel extends DimensionPanel {

  static inject() {
    return [DeviceStore, EventAggregator];
  }

  constructor(DeviceStore, EventAggregator) {
    super(DeviceStore, EventAggregator, 'device', EVENTS);
  }
}
