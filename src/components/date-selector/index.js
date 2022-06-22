import {bindable} from 'aurelia-framework';
import config from './../../../config/client.config.provider';
import {EventAggregator} from 'aurelia-event-aggregator';

export const DEFAULTS = {
  START_YEAR : 1981,
  END_YEAR   : new Date().getUTCFullYear() + config('timeframe.defaultOffset.end', 0)
};

export const EVENTS = {
  ONDATECHANGE: 'dateselector_ondatechange'
};

export class DateSelector {
  @bindable dateLabel;
  @bindable selectedYear;
  @bindable date;
  @bindable interval;
  @bindable name;

  static inject () {
    return [EventAggregator];
  }

  constructor (eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.availableYears = [];

    for (let i = DEFAULTS.START_YEAR; i <= DEFAULTS.END_YEAR; i++)
      this.availableYears.push(i);
  }

  intervalChanged () {
    this.setDate(this.date);
  }

  dateChanged (timestamp) {
    this.setDate(timestamp);
  }

  setDate (timestamp) {
    const month = new Date(timestamp).getUTCMonth() + 1;
    this.month = month;
    this.quarter = (Math.ceil(month / 3));
    this.year = new Date(timestamp).getUTCFullYear();
  }

  quarterChanged (e) {
    if (this.name === 'start') {
      const newDate = this.getFirstDayOfTheQuarter();
      this.eventAggregator.publish(EVENTS.ONDATECHANGE, {
        name: this.name,
        value: newDate.getTime()
      });
    }
    if (this.name === 'end') {
      const newDate = this.getLastDayOfTheQuarter();
      this.eventAggregator.publish(EVENTS.ONDATECHANGE, {
        name: this.name,
        value: newDate.getTime()
      });
    }
  }

  getLastDayOfTheQuarter () {
    const quarter = parseInt(this.quarter);
    const currentAsDate = new Date(this.date);
    const month = quarter * 3;
    return new Date(Date.UTC(currentAsDate.getUTCFullYear(), month, 0));
  }

  getFirstDayOfTheQuarter () {
    const quarter = parseInt(this.quarter);
    const currentAsDate = new Date(this.date);
    const month = (quarter - 1) * 3;
    return new Date(Date.UTC(currentAsDate.getUTCFullYear(), month, 1));
  }

  yearChanged (e) {
    const year = parseInt(this.year);
    const currentAsDate = new Date(this.date);
    currentAsDate.setUTCFullYear(year);
    this.eventAggregator.publish(EVENTS.ONDATECHANGE, {
      name: this.name,
      value: currentAsDate.getTime()
    });
  }
}
