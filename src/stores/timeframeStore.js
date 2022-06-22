import { AnalyticsService } from './../services/analyticsService';
import cloneDeep from 'lodash/cloneDeep';
import config from './../../config/client.config.provider';
import { HashStateStore } from './hashStateStore';
import { LoggerService } from './../services/loggerService';
import Store from './store';
import * as GLOBAL_EVENTS from './../events';

export const TIMEFRAME = {
  INTERVAL : {
    QUARTERLY : 'quarterly',
    YEARLY    : 'yearly'
  },
  MONTH    : {
    JANUARY   : 0,
    DECEMBER  : 11
  }
};

export const ANALYTICS = AnalyticsService.register({
  TIMEFRAME_UPDATED: GLOBAL_EVENTS.TIMEFRAME_UPDATED
});

export const DEFAULTS = {
  // Maximum timerange in years
  MAXIMUM_TIMERANGE_YEARS : config('timeframe.maximumTimerangeYears', 14),
  MAXIMUM_TIMERANGE_QUARTER : config('timeframe.maximumTimerangeQuarter', 9),
  OFFSET_START_YEARS      : config('timeframe.defaultOffset.start', 0),
  OFFSET_END_YEARS        : config('timeframe.defaultOffset.end', 0)
};

function getFirstDayOfTheYear(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

function getLastDayOfTheYear(date) {
  return new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 0));
}

function getFirstDayOfTheQuarter(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), Math.floor(date.getUTCMonth() / 3) * 3, 1));
}

function getLastDayOfTheQuarter(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), (Math.floor(date.getUTCMonth() / 3) + 1) * 3, 0));
}

export class TimeframeStore extends Store {

  static inject() {
    return [AnalyticsService, LoggerService];
  }

  get STORES() {
    return [
      HashStateStore
    ];
  }

  constructor(analyticsService, loggerService, ...rest) {
    super(...rest);
    this.analyticsService = analyticsService;
    this.logger = loggerService.createLogger(this.constructor.name);
  }

  onStoreChange(data, store) {
    switch (store) {
    case HashStateStore:
      this.data = this.getDefaultState();
      break;
    }
  }

  name() {
    return 'timeframe';
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.TIMEFRAME_UPDATED,
      GLOBAL_EVENTS.RESET_TIME_FRAME
    ];
  }

  getDefaultState() {
    const hashState = this.stores.HashStateStore.data;
    if(hashState.query && hashState.query.range) {
      return hashState.query.range;
    }

    const now = new Date();
    const startDate = new Date(Date.UTC(now.getUTCFullYear() - DEFAULTS.OFFSET_START_YEARS, TIMEFRAME.MONTH.JANUARY, 1));
    const endDate = new Date(Date.UTC(now.getUTCFullYear() + DEFAULTS.OFFSET_END_YEARS, TIMEFRAME.MONTH.DECEMBER, 31));
    return {
      interval: TIMEFRAME.INTERVAL.YEARLY,
      start: startDate.getTime(),
      end: endDate.getTime()
    };
  }

  setTimeFrame(data) {
    let wasReversed = false;
    if (data.end < data.start) {
      // Reverse the from and to
      const tmpStart = data.start;
      const tmpEnd = data.end;
      data.start = tmpEnd;
      data.end = tmpStart;
      wasReversed = true;
    }

    const timeframe = data;
    const bound     = { lower: new Date(this.data.start), upper: new Date(this.data.end) };
    const exceeded  = { lower: false, upper: false };
    const endDate   = new Date(timeframe.end);
    const fn        = {
      [TIMEFRAME.INTERVAL.QUARTERLY] : { end: getLastDayOfTheQuarter, start: getFirstDayOfTheQuarter },
      [TIMEFRAME.INTERVAL.YEARLY]    : { end: getLastDayOfTheYear, start: getFirstDayOfTheYear },
    };
    const startDate = new Date(timeframe.start);
    let maxTimeRange = DEFAULTS.MAXIMUM_TIMERANGE_YEARS;
    if (timeframe.interval === TIMEFRAME.INTERVAL.QUARTERLY) {
      maxTimeRange = DEFAULTS.MAXIMUM_TIMERANGE_QUARTER;
    }

    if (timeframe.end !== this.data.end || this.intervalChange) {
      const lower = new Date(Date.UTC(endDate.getUTCFullYear() - maxTimeRange, endDate.getUTCMonth(), endDate.getUTCDate()));
      if (timeframe.interval === TIMEFRAME.INTERVAL.QUARTERLY) {
        lower.setUTCMonth(lower.getUTCMonth() + 3);
      }
      const upper = endDate;

      bound.lower = fn[timeframe.interval].start(lower);
      bound.upper = fn[timeframe.interval].end(upper);
    }

    if (timeframe.start !== this.data.start || data.intervalChange) {
      const lower = startDate;
      const upper = new Date(Date.UTC(startDate.getUTCFullYear() + maxTimeRange, startDate.getUTCMonth(), startDate.getUTCDate()));
      if (timeframe.interval === TIMEFRAME.INTERVAL.QUARTERLY) {
        upper.setUTCMonth(upper.getUTCMonth() - 3);
      }

      bound.lower = fn[timeframe.interval].start(lower);
      bound.upper = fn[timeframe.interval].end(upper);
    }

    exceeded.lower = startDate < bound.lower;
    exceeded.upper = endDate > bound.upper;

    timeframe.end     = fn[timeframe.interval].end(exceeded.upper ? bound.upper : endDate).getTime();
    timeframe.start   = fn[timeframe.interval].start(exceeded.lower ? bound.lower : startDate).getTime();
    timeframe.warnings = [];

    if (exceeded.upper || exceeded.lower) {
      if (timeframe.interval === TIMEFRAME.INTERVAL.QUARTERLY) {
        timeframe.warnings.push(`The maximum selectable quarterly timeframe is ${DEFAULTS.MAXIMUM_TIMERANGE_QUARTER} years.`);
      } else {
        timeframe.warnings.push(`The maximum selectable yearly timeframe is ${DEFAULTS.MAXIMUM_TIMERANGE_YEARS + 1} years.`);
      }
    }

    if (wasReversed) {
      timeframe.warnings.push('The end date cannot be before the start date. The values were reversed.');
    }

    this.data = cloneDeep(timeframe);

    this.logger.info('timeframe set', {
      start: new Date(this.data.start).toISOString().replace(/T.*$/, ''),
      end: new Date(this.data.end).toISOString().replace(/T.*$/, '')
    });
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.TIMEFRAME_UPDATED:
      this.setTimeFrame(data);
      this.analyticsService.pushEvent(event, {
        timeframeInterval: data.interval,
        timeframeStart: new Date(this.data.start).toISOString().replace(/T.*$/, ''),
        timeframeEnd: new Date(this.data.end).toISOString().replace(/T.*$/, '')
      });
      break;
    case GLOBAL_EVENTS.RESET_TIME_FRAME:
      this.setTimeFrame(this.getDefaultState(true));
      break;
    }
  }
}
