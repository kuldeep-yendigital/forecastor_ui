import {DataStore} from '../../stores/dataStore';
import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EVENTS as DataStoreEvents} from '../../stores/dataStore';
import {TIMEFRAME} from '../../stores/timeframeStore';

require('./index.scss');

export const EVENTS = {
  ONINTERVALCHANGE: 'intervalselector_onintervalchange'
};

export class IntervalSelector {

  @bindable selectedInterval;

  static inject() {
    return [DataStore, EventAggregator];
  }

  constructor(dataStore, eventAggregator) {
    this.dataStore = dataStore;
    this.TIMEFRAME = TIMEFRAME;
    this.eventAggregator = eventAggregator;
    this.onIntervalChange = this.onIntervalChange.bind(this);
  }

  attached() {
    this.subscriptions = [
      this.dataStore.subscribe(this.refreshData.bind(this))
    ];
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  refreshData(data) {
    this.isIntervalUpdating = data.isUpdating;
  }

  onIntervalChange() {
    setImmediate(_ => this.eventAggregator.publish(EVENTS.ONINTERVALCHANGE, this.selectedInterval));
  }
}
