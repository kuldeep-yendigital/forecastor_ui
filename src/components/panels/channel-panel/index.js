import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { ChannelStore, EVENTS } from '../../../stores/channelStore';

export class ChannelPanel extends DimensionPanel {

  static inject() {
    return [ChannelStore, EventAggregator];
  }

  constructor(ChannelStore, EventAggregator) {
    super(ChannelStore, EventAggregator, 'channel', EVENTS);
  }
}
