import { QueryStore } from './queryStore';
import { TimeframeStore, TIMEFRAME } from './timeframeStore';
import { ColumnStore } from './columnStore';
import * as GLOBAL_EVENTS from '../events';
import { Container } from 'aurelia-dependency-injection';
import { HashStateStore } from './hashStateStore';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine } from 'aurelia-framework';
import { AnalyticsService } from '../services/analyticsService';

import MockStore, { BindingEngineMock, EventAggregatorMock, GenericServiceMock } from '../../test/unit/helpers/mock-store';
import { GenericService } from '../services/genericService';


describe('queryStore', () => {

  let container;

  beforeEach(() => {
    const timeframStore = new MockStore(null, {});
    const columnStore = new MockStore(null, { columns: [
      {label: 'field1', key: 'field1_field', field: 'field1_field', parent: 'group1', checked: true},
      {label: 'field2', key: 'field2_field', field: 'field2_field', parent: 'group1', checked: true},
      {label: 'field3', key: 'companyname_name', field: 'companyname_name', parent: 'group2', checked: true}
    ] });
    columnStore.getColumns = () => [];
    columnStore.getLeftMostColumn = () => columnStore.data.columns.filter(c => c.checked)[0];
    columnStore.getColumnByKey = (k) => columnStore.data.columns.find(c => c.key === k);
    const hashStateStore = new MockStore(null, {});

    container = new Container().makeGlobal();
    container.registerInstance(TimeframeStore, timeframStore);
    container.registerInstance(ColumnStore, columnStore);
    container.registerInstance(HashStateStore, hashStateStore);
    container.registerInstance(BindingEngine, BindingEngineMock);
    container.registerInstance(EventAggregator, EventAggregatorMock);
    container.registerInstance(GenericService, GenericServiceMock);
    container.registerInstance(AnalyticsService, {
      pushEvent: () => {}
    });
  });


  describe('defaults', () => {

    it('metric to subscriptions', () => {
      const queryStore = container.get(QueryStore);

      expect(queryStore.data.compositeFilters).toEqual({
        metricindicator: [ 'Total' ]
      });
    });

    it('should always sort by the left most columns ascending', () => {
      const queryStore = container.get(QueryStore);

      // Test the default left most
      expect(queryStore.data.sortedColumnId).toEqual('field1_field');
      expect(queryStore.data.sortDirection).toEqual('asc');

      // Make sure it filters for checked columns
      const columnStore = container.get(ColumnStore);
      columnStore.data.columns[0].checked = false;

      // Trigger a store update
      queryStore.onStoreChange(columnStore.data, ColumnStore);

      expect(queryStore.data.sortedColumnId).toEqual('field2_field');
      expect(queryStore.data.sortDirection).toEqual('asc');
    });
  });

  describe('adding filter', () => {
    it('creates filter', (done) => {
      const queryStore = container.get(QueryStore);

      queryStore.onEvent([
        {type: 'type1', name: 'filter1'},
        {type: 'type2', name: 'filter2'}
      ], GLOBAL_EVENTS.FILTERS_ADDED);

      setImmediate(() => {
        expect(Object.keys(queryStore.data.filters).length).toEqual(2);
        expect(queryStore.data.filters['type1']).toEqual(['filter1']);
        expect(queryStore.data.filters['type2']).toEqual(['filter2']);
        done();
      });
    });

    it('appends to existing filter', (done) => {
      const queryStore = container.get(QueryStore);

      queryStore.onEvent([
        {type: 'type1', name: 'filter1'},
        {type: 'type1', name: 'filter2'},
        {type: 'type2', name: 'filter3'},
        {type: 'type2', name: 'filter4'}
      ], GLOBAL_EVENTS.FILTERS_ADDED);

      setImmediate(() => {
        expect(Object.keys(queryStore.data.filters).length).toEqual(2);
        expect(queryStore.data.filters['type1']).toEqual(['filter1', 'filter2']);
        expect(queryStore.data.filters['type2']).toEqual(['filter3', 'filter4']);
        done();
      });
    });
  });

  describe('removing filter', () => {
    it('removes filter', (done) => {
      const queryStore = container.get(QueryStore);

      queryStore.data.filters = {
        'type1': ['filter1', 'filter2'],
        'type2': ['filter3', 'filter4']
      };

      queryStore.onEvent([
        {type: 'type1', name: 'filter2'},
        {type: 'type2', name: 'filter4'}
      ], GLOBAL_EVENTS.FILTERS_REMOVED);

      setImmediate(() => {
        expect(queryStore.data.filters['type1']).toEqual(['filter1']);
        expect(queryStore.data.filters['type2']).toEqual(['filter3']);
        done();
      });
    });

    it('removes filter type', (done) => {
      const queryStore = container.get(QueryStore);

      queryStore.data.filters = {
        'type1': ['filter1'],
        'type2': ['filter2']
      };

      queryStore.onEvent([
        {type: 'type1', name: 'filter1'},
        {type: 'type2', name: 'filter2'}
      ], GLOBAL_EVENTS.FILTERS_REMOVED);

      setImmediate(() => {
        expect(Object.keys(queryStore.data.filters).length).toEqual(0);
        expect(queryStore.data.filters['type1']).toEqual(undefined);
        expect(queryStore.data.filters['type2']).toEqual(undefined);
        done();
      });
    });
  });

  describe('Validate Dimension Sort', () => {

    beforeEach(() => {
      container.get(ColumnStore).data = { columns: [
        {label: 'field1', key: 'field1_field', field: 'field1_field', parent: 'group1', checked: true},
        {label: 'field2', key: 'field2_field', field: 'field2_field', parent: 'group1', checked: true},
        {label: 'field3', key: 'companyname_name', field: 'companyname_name', parent: 'group2', checked: true}
      ] };
    });

    it('should do nothing if current sort column is still valid', () => {
      const queryStore = container.get(QueryStore);
      container.get(ColumnStore).data.columns[1].checked = false;
      queryStore.validateDimensionSort();
      expect(queryStore.data.sortedColumnId).toEqual('field1_field');
      expect(queryStore.data.sortDirection).toEqual('asc');
    });

    it('should set column to left most if sort column is no longer valid', () => {
      const queryStore = container.get(QueryStore);
      container.get(ColumnStore).data.columns[0].checked = false;
      queryStore.validateDimensionSort();
      expect(queryStore.data.sortedColumnId).toEqual('field2_field');
      expect(queryStore.data.sortDirection).toEqual('asc');
    });
  });

  describe('Numerical Sort', () => {

    beforeEach(() => {
      const startDate = new Date(Date.parse('2005/01/31 UTC'));
      const endDate = new Date(Date.parse('2010/01/31 UTC'));
      container.get(TimeframeStore).data = {
        interval: TIMEFRAME.INTERVAL.YEARLY,
        start: startDate.getTime(),
        end: endDate.getTime()
      };
      container.get(QueryStore).data.sortedColumnId = '31/01/2006';
    });

    it('should do nothing if current sort column is still valid', () => {
      const queryStore = container.get(QueryStore);
      queryStore.validateNumericalSort();
      expect(queryStore.data.sortedColumnId).toEqual('31/01/2006');
    });

    it('should set column to left most if sort column is no longer valid', () => {
      const queryStore = container.get(QueryStore);
      queryStore.stores.TimeframeStore.data.start = new Date(Date.parse('2007/01/31 UTC'));
      queryStore.validateNumericalSort();
      expect(queryStore.data.sortedColumnId).toEqual('field1_field');
    });

    it('should set column to left most if timeframe interval is changed', () => {
      const queryStore = container.get(QueryStore);
      queryStore.stores.TimeframeStore.data.interval = TIMEFRAME.INTERVAL.QUARTERLY;
      queryStore.validateNumericalSort();
      expect(queryStore.data.sortedColumnId).toEqual('field1_field');
    });

    it('should set column to left most if multiple metric filters selected', () => {
      const queryStore = container.get(QueryStore);
      queryStore.data.compositeFilters.metric = ['one', 'two'];
      queryStore.validateNumericalSort();
      expect(queryStore.data.sortedColumnId).toEqual('field1_field');
    });
  });

  describe('Column sorted', () => {
    it('should update sort column id and direction', (done) => {
      const queryStore = container.get(QueryStore);
      const eventData = {
        sortState: 'sortState',
        columnId: 'columnId'
      };
      queryStore.onEvent(eventData, GLOBAL_EVENTS.COLUMN_SORTED);

      setImmediate(() => {
        expect(queryStore.data.sortDirection).toEqual('sortState');
        expect(queryStore.data.sortedColumnId).toEqual('columnId');
        done();
      });
    });
  });

  describe('Reset to default', () => {
    beforeEach(() => {

      // The defaults are resolved on construction, set up
      // some defaults...
      container.get(TimeframeStore).data = {
        interval: TIMEFRAME.INTERVAL.QUARTERLY,
        start: new Date(Date.parse('2008/12/31 UTC')).getTime(),
        end: new Date(Date.parse('2010/03/31 UTC')).getTime()
      };

      container.get(ColumnStore).data = {
        columns: [
          { label: 'geographylevel1', key: 'geographylevel1', parent: 'geography', checked: true },
          { label: 'geographylevel2', key: 'geographylevel2', parent: 'geography', checked: false },
          { label: 'dataset', key: 'dataset', parent: 'dataset', checked: true }
        ]
      };

      container.get(HashStateStore).data = {};
    });

    it('should reset to the default grid state when hashstate is empty', () => {
      const queryStore = container.get(QueryStore);
      const columnStore = container.get(ColumnStore);
      const hashStateStore = container.get(HashStateStore);
      columnStore.data = {
        columns: [
          { label: 'geographylevel1', key: 'geographylevel1', parent: 'geography', checked: false },
          { label: 'geographylevel2', key: 'geographylevel2', parent: 'geography', checked: false },
          { label: 'dataset', key: 'dataset', parent: 'dataset', checked: true }
        ]
      };

      // Change to the column store
      queryStore.onStoreChange(columnStore.data, ColumnStore);

      // Default state triggered by hash state store
      queryStore.onStoreChange(hashStateStore.data, HashStateStore);

      expect(queryStore.data).toEqual({
        filters: {},
        compositeFilters: {
          metricindicator: [ 'Total' ]
        },
        range: {
          start: new Date(Date.parse('2008/12/31 UTC')).getTime(),
          end: new Date(Date.parse('2010/03/31 UTC')).getTime(),
          interval: 'quarterly'
        },
        sortedColumnId: 'geographylevel1',
        sortDirection: 'asc',
        columnKeys: []
      });
    });
  });
});
