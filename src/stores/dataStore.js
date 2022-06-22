import DataService from '../services/dataService';
import {
  AnalyticsService
} from '../services/analyticsService';
import Store from './store';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as GLOBAL_EVENTS from '../events';
import forEach from 'lodash/forEach';
import { flattenHierarchicalList } from '../components/panels/multi-list-panel/helpers';

import {
  QueryStore
} from './queryStore';

export const EVENTS = {
  FETCH_START: 'dataStore.fetch_start',
  FETCH_NEXT_PAGE: 'dataStore.fetch_next_page',
  UNCHECK_ALL: 'dataStore.uncheck_all',
  FETCH_COUNT: 'dataStore.fetch_count',
  FETCH_FILTER_DISTINCT: 'dataStore.fetch_filter_distinct',
  FETCH_FILTER_DISTINCT_DONE: 'dataStore.fetch_filter_distinct_done'
};

export const ANALYTICS = AnalyticsService.register({
  FETCH_DATA: 'dataStore.fetch_data',
  FETCH_DATA_PAGE: 'dataStore.fetch_data_page'
});

export class DataStore extends Store {

  static inject() {
    return [
      DataService,
      AnalyticsService,
      'config'
    ];
  }

  constructor(DataService, AnalyticsService, Config, ...rest) {
    super(...rest);
    this.dataService = DataService;
    this.socket = null;
    this.analyticsService = AnalyticsService;
    this.config = Config;
    this.offset = 0;
    this.fetchedPage = false;
    this.longFetchTimer = null;
    this.rowCountListener = null;
    this.dataListener = null;
  }

  get EVENTS() {
    return [
      EVENTS.FETCH_NEXT_PAGE,
      EVENTS.UNCHECK_ALL,
      EVENTS.FETCH_COUNT,
      EVENTS.FETCH_FILTER_DISTINCT
    ];
  }

  get STORES() {
    return [
      QueryStore
    ];
  }

  getDefaultState() {
    return {
      isUpdating: true
    };
  }

  connectSocket(recEvent = 'data', cb = this.onFetchData.bind(this)) {
    return this.dataService.connect().then(() => {
      this.dataService.socket.on(recEvent, cb);
      this.socket = this.dataService.socket;
    });
  }

  fetchFilterColumnDistinct(dimension) {
    const query = cloneDeep(this.stores.QueryStore.data);

    this.filteredDimension = dimension;
    this.filterColumnnDistinctListener = this.onFetchFilterColumnDistinct.bind(this);
    return this.connectSocket('dimensionDistinct', this.filterColumnnDistinctListener)
      .then(() => {
        return this.service.fetch(`${this.config.get('filterColumnDistinctUrl')}`, {
          method: 'POST',
          body: JSON.stringify({
            query: query,
            dimension: dimension,
            'client_id': this.dataService.clientId
          })
        });
      });
  }

  onFetchFilterColumnDistinct(data) {
    this.publish(EVENTS.FETCH_FILTER_DISTINCT_DONE, {
      dimension: this.filteredDimension,
      data: [
        ...data
      ]
    });
    this.socket.removeListener('dimensionDistinct');
  }

  fetchCount(dimensions) {
    this.offset = 0;
    const query = cloneDeep(this.stores.QueryStore.data);
    // Store the active dimension ids in an array to pass over to the service
    const selected = [];
    const flatList = flattenHierarchicalList(dimensions[Object.keys(dimensions)[0]]);
    forEach(flatList, (flatDimension) => {
      if (flatDimension.state === 1) {
        selected.push(flatDimension.id);
      }
    });

    this.rowCountListener = this.onFetchRowCounts.bind(this);

    return this.connectSocket('rowCounts', this.rowCountListener).then(() => {
      return this.service.fetch(`${this.config.get('taxonomyApiUrl')}/hierarchy/count`, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          'count_dimensions': dimensions,
          'client_id': this.dataService.clientId,
          selected: selected
        })
      });
    });
  }

  onFetchRowCounts(data) {
    this.publish(GLOBAL_EVENTS.DIMENSION_COUNT_DONE, data);
    this.socket.removeListener('rowCounts');
  }

  fetchData() {
    if(!this.longFetchTimer) {
      const longQueryMsg = 'This query is taking a while, please bear with us or reduce your filters';
      this.longFetchTimer = setTimeout(() => {
        this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, longQueryMsg);
      }, window.config.longFetchTimerMs);
    }

    this.offset = 0;
    const query = cloneDeep(this.stores.QueryStore.data);

    const inputData = { query, columnKeys: query.columnKeys };

    if (isEqual(inputData, this.previousInputData)) {
      return Promise.resolve(this.data);
    } else {
      this.publish(EVENTS.FETCH_START);
      this.data = {
        ...this.data,
        isUpdating: true
      };
      this.previousInputData = inputData;
      if (this.socket === null) {
        return this.connectSocket().then(() => {
          return this.dataService.fetch(query, query.columnKeys);
        });
      }
      else {
        return this.dataService.fetch(query, query.columnKeys);
      }
    }
  }

  onFetchData(data) {
    // Cancel long query notice
    if(this.longFetchTimer) {
      window.clearTimeout(this.longFetchTimer);
    }

    if (this.fetchedPage) {
      data.records = this.data.records.concat(data.records);
      this.analyticsService.pushEvent(ANALYTICS.FETCH_DATA_PAGE, {
        recordCount: data.records.length
      });
      this.fetchedPage = false;
    }
    const query = cloneDeep(this.stores.QueryStore.data);
    this.offset += 200;
    this.data = {
      ...this.data,
      ...data,

      // TODO: Move this to the API
      records: data.records.map(record => ({
        ...record,
        key: query.columnKeys.map(key => record[key])
      })),
      rowCount: data.rowCount,
      isUpdating: false
    };
    this.analyticsService.pushEvent(ANALYTICS.FETCH_DATA, {
      recordCount: this.data.records.length
    });
  }

  fetchPageOfData() {
    this.fetchedPage = true;
    const query = {
      ...cloneDeep(this.stores.QueryStore.data),
      offset: this.offset
    };
    if (this.socket === null) {
      return this.connectSocket().then(() => {
        return this.dataService.fetch(query, query.columnKeys);
      });
    }
    else {
      return this.dataService.fetch(query, query.columnKeys);
    }
  }

  uncheckAll() {
    this.data = {
      ...this.data,
      records: this.data.records.map(record => ({
        ...record,
        checked: false
      }))
    };
  }

  onEvent(data, event) {
    switch (event) {
    case EVENTS.FETCH_NEXT_PAGE:
      this.fetchPageOfData();
      break;

    case EVENTS.UNCHECK_ALL:
      this.uncheckAll();
      break;

    case EVENTS.FETCH_COUNT:
      this.fetchCount(data);
      break;

    case EVENTS.FETCH_FILTER_DISTINCT:
      this.fetchFilterColumnDistinct(data);
      break;
    }
  }

  onStoreChange(data, store) {
    switch (store) {
    case QueryStore:
      this.fetchData();
      break;
    }
  }
}
