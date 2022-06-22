import {BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {EVENTS as DateSelectorEvents} from '../../date-selector/index';
import {EVENTS as IntervalSelectorEvents} from '../../interval-selector/index';
import * as GLOBAL_EVENTS from '../../../events';
import {TimeframeStore} from '../../../stores/timeframeStore';
import {StoreComponent} from '../../store-component';

require('./index.scss');

export class TimeframePanel extends StoreComponent {
  static inject() {
    return [TimeframeStore, EventAggregator, BindingEngine];
  }

  constructor(TimeframeStore, EventAggregator) {
    super(TimeframeStore, EventAggregator);
    this.timeframeStore = TimeframeStore;
    this.onDateUpdated = this.onDateUpdated.bind(this);
    this.onIntervalUpdated = this.onIntervalUpdated.bind(this);
  }

  attached() {
    this.subscribe(DateSelectorEvents.ONDATECHANGE, this.onDateUpdated);
    this.subscribe(IntervalSelectorEvents.ONINTERVALCHANGE, this.onIntervalUpdated);
  }

  activate(model) {
    if (model) {
      this.subscriptions.push(this.timeframeStore.subscribe(this.setDate.bind(this)));
      this.setDate();
    }
  }

  setDate() {
    this.start = this.timeframeStore.data.start;
    this.end = this.timeframeStore.data.end;
    this.interval = this.timeframeStore.data.interval;
    this.warnings = Array.isArray(this.timeframeStore.data.warnings) ?
      this.timeframeStore.data.warnings :
      [this.timeframeStore.data.warnings];
  }

  onDateUpdated(e) {
    // Set either start or end
    this[e.name] = e.value;

    if (this.start && this.end) {
      this.eventAggregator.publish(GLOBAL_EVENTS.TIMEFRAME_UPDATED, {
        interval: this.interval,
        start: this.start,
        end: this.end
      });
    }
  }

  onIntervalUpdated(newInterval) {
    this.interval = newInterval;
    this.eventAggregator.publish(GLOBAL_EVENTS.TIMEFRAME_UPDATED, {
      interval: this.interval,
      start: this.start,
      end: this.end,
      intervalChange: true
    });
  }
}
