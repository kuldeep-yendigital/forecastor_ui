import { EventAggregator } from 'aurelia-event-aggregator';
import { DimensionPanel } from '../../dimension-panel';
import { DataSetStore, EVENTS } from '../../../stores/dataSetStore';

export class DataSetPanel extends DimensionPanel {

  static inject() {
    return [DataSetStore, EventAggregator];
  }

  constructor(DataSetStore, EventAggregator) {
    super(DataSetStore, EventAggregator, 'dataset', EVENTS);
  }
}
