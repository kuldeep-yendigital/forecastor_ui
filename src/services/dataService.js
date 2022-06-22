import { EventAggregator } from 'aurelia-event-aggregator';
import io from 'socket.io-client';
import { AnalyticsService } from './analyticsService';
import * as GLOBAL_EVENTS from '../events';

function getSortField(sortedKeys, query) {
  const isDate = column => column.match(/^\d{2}\/\d{2}\/\d{4}$/);

  return query && query.sortedColumnId
    ? {
      direction : query.sortDirection,
      type      : isDate(query.sortedColumnId)
        ? 'value_sort'
        : 'dimension_sort',
      value     : query.sortedColumnId
    } : {
      direction : 'asc',
      type      : 'dimension_sort',
      value     : sortedKeys[0]
    };
}

export const EVENTS = {
  TIMED_OUT: 'DataFetch_TimedOut'
};

export const ANALYTICS = AnalyticsService.register({
  FETCH_TIMEDOUT: EVENTS.TIMED_OUT
});

export default class DataService {
  static inject() {
    return [EventAggregator, 'config', 'request', AnalyticsService];
  }

  constructor(EventAggregator, config, request, analyticsService) {
    this.eventAggregator = EventAggregator;
    this.config = config;
    this.request = request;
    this.activeRequest = null;
    this.analyticsService = analyticsService;
    this.export = this.export.bind(this);
    this.excel = this.excel.bind(this);
    this.sticky = null;
  }

  connect() {
    return new Promise((resolve) => {
      if (this.socket) {
        return resolve();
      }

      this.connectionResolver = resolve;
      this._socket = io.connect(this.config.get('websocket').host, {
        extraHeaders: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        transports: ['polling', 'websocket'],
        upgrade: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
      });
      this.socket.on('state', this.onStateChange.bind(this));
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected. Reconnecting...');
        setTimeout(this.socket.connect, 5000);
      });
    });
  }

  onStateChange(sockState) {
    if (sockState.state === 'ready') {
      this.clientId = sockState.id;
      const date = new Date();
      date.setTime(date.getTime() + 86400);
      document.cookie = `AWSALB=${sockState.ALB};path=/;domain=localhost;expires=${date.toUTCString()}`;
      this.connectionResolver();
    }
  }

  get socket() {
    return this._socket;
  }

  filterColumn({ query, columnKeys, clientId }) {
    return this.innerFetch({
      columnKeys,
      query,
      clientId,
      url: this.config.get('filterColumnDistinctUrl')
    });
  }

  excel({ query, columnKeys, pinnedColumns, clientId }) {
    return this.innerFetch({
      columnKeys : columnKeys,
      headers    : { 'Accept' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      pinned     : pinnedColumns || [],
      query      : query,
      clientId,
      url        : this.config.get('exportApiUrl')
    });
  }

  export({ query, columnKeys, clientId }) {
    return this.innerFetch({
      columnKeys,
      query,
      clientId,
      url : this.config.get('exportApiUrl')
    });
  }

  fetch(query, columnKeys) {
    return this.innerFetch({
      columnKeys,
      query,
      url : this.config.get('dataApiUrl')
    });
  }

  innerFetch(params) {
    if (!params.columnKeys) {
      return Promise.reject('Missing parameter "columnKeys".');
    }
    if (!params.query) {
      return Promise.reject('Missing parameter "query".');
    }
    if (!params.url) {
      return Promise.reject('Missing parameter "url".');
    }

    const options = {
      query              : params.query,
      'valueField'        :  params.query.valueField,
      'client_id'          : params.clientId || this.clientId,
      'page_size'          : 200,
      pinned             : params.pinned || [],
      fields             : params.columnKeys,
      'sort_field'         : getSortField(params.columnKeys, params.query),
      'timeframe_interval' : params.query.range
        && config.timeframe.intervals.indexOf(params.query.range.interval) > -1
        ? params.query.range.interval
        : 'yearly'
    };

    if (this.activeRequest && this.activeRequest.isCancellable()) {
      this.activeRequest.cancel();
    }

    this.activeRequest = this.request.fetch(params.url, Object.assign({
      body   : JSON.stringify(options),
      method : 'POST'
    }, {
      headers: params.headers || {}
    }))
      .then(response => JSON.parse(response))
      .catch((error) => {
        if(error.name.toLowerCase().indexOf('timeout')> - 1) {
          this.eventAggregator.publish(
            GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
            'This query is taking too long to process, please refine your search filters.'
          );
          this.analyticsService.pushEvent(ANALYTICS.FETCH_TIMEDOUT, options);
        }
        throw error;
      });

    return this.activeRequest;
  }
}
