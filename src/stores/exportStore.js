import Store from './store';
import { ColumnStore } from './columnStore';
import { DataStore } from './dataStore';
import { QueryStore } from './queryStore';
import { AuthStore } from './authStore';
import { AnalyticsService } from '../services/analyticsService';
import DataService from '../services/dataService';
import * as GLOBAL_EVENTS from "../events";
import cloneDeep from 'lodash/cloneDeep';
import io from 'socket.io-client';

export const EVENTS = {
  COMPLETED     : 'Export_Completed',
  DOWNLOADED    : 'Export_Downloaded',
  FAILED        : 'Export_Failed',
  STARTED       : 'Export_Started'
};

export const ANALYTICS = AnalyticsService.register({
  EXPORT_STARTED : EVENTS.STARTED,
  EXPORT_FAILED : EVENTS.FAILED
});

const MAXIMUM_NUM_OF_DATAPOINTS_TO_EXPORT = 1000000;
const CSV_STARTED_MESSAGE = 'Export started, your download will start automatically.';
const EXCEL_STARTED_MESSAGE = `${CSV_STARTED_MESSAGE}<br />Note: Excel exports are limited to 20k rows`;

export const FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel'
};

export class ExportStore extends Store {

  get EVENTS() {
    return [
      EVENTS.STARTED
    ];
  }

  static inject() {
    return [
      'config', ColumnStore, DataStore, QueryStore, AuthStore, DataService, AnalyticsService
    ];
  }

  constructor(config, columnStore, dataStore, queryStore, authStore, dataService, analyticsService, ...rest) {
    super(...rest);
    this.config = config;
    this.columnStore = columnStore;
    this.dataStore = dataStore;
    this.queryStore = queryStore;
    this.authStore = authStore;
    this.dataService = dataService;
    this.analyticsService = analyticsService;
  }

  name() {
    return 'export';
  }


  connectWS() {
    return new Promise((resolve) => {
      if (this.socket) {
        return resolve(this.clientId);
      }

      this.connectionResolver = resolve;
      this.socket = io.connect(this.config.get('exportApi'), {
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
    });

  }

  onStateChange(sockState) {
    switch (sockState.state) {
      case 'ready':
        this.clientId = sockState.id;
        this.connectionResolver(this.clientId);
        break;
      case 'download':
        window.location = sockState.location;
        this.data.inProgress = false;
        this.socket.close();
        this.socket = null;
        break;
      case 'error':
        this.data.inProgress = false;
        this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, sockState.errorMessage);
        break;
      }

  }

  export(data) {
    const exportFn = data.format === FORMATS.EXCEL
      ? this.dataService.excel
      : this.dataService.export;
    const STARTED_MESSAGE = data.format === FORMATS.EXCEL
      ? EXCEL_STARTED_MESSAGE
      : CSV_STARTED_MESSAGE;

    if (this.data.inProgress) {
      return this.publish(
        GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
        'Please wait download will start automatically.'
      );
    }

    if(this.dataStore.data.totalNumOfDataPoints > MAXIMUM_NUM_OF_DATAPOINTS_TO_EXPORT) {
      return this.publish(
        GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
        `For beta you can only export up to ‘${MAXIMUM_NUM_OF_DATAPOINTS_TO_EXPORT}’ data points. There are currently ‘${numOfDataPoints}’ data points in your search.  Please refine your search further before exporting.`
      );
    }

    this.data.inProgress = true;

    const query  = cloneDeep(this.queryStore.data);
    const pinned = cloneDeep(this.columnStore.data.pinned);

    return this.connectWS()
      .then((clientId) => {
        return exportFn({ query, columnKeys: query.columnKeys, pinnedColumns: pinned, clientId })
          .then(response => {
            if (response.empty) {
              this.data.inProgress = false;
              this.publish(
                GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
                `Your trial subscriptions cannot be exported.`
              );
            } else if (response.hasTrial) {
              this.publish(
                GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
                `${STARTED_MESSAGE} Your trial subscriptions will not be exported.`
              );
            } else {
              this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, STARTED_MESSAGE);
            }
          })
          .catch(err => {
            this.data.inProgress = false;
            this.data.error = true;
            this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE,
              'Export failed, please try again later.');
            this.analyticsService.pushEvent(ANALYTICS.EXPORT_FAILED);
          });
      });
  }

  getDefaultState() {
    return {
      error       : false,
      inProgress  : false
    };
  }

  onEvent(data, event) {
    switch (event) {
      case EVENTS.STARTED:
        this.data.inProgress = false;
        this.data.error = false;
        this.export(data);
        this.analyticsService.pushEvent(ANALYTICS.EXPORT_STARTED);
        break;
    }
  }
}
