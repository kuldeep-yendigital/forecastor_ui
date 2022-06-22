import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import * as SortState from './SortState';
import Store from '../../stores/store';
import { QueryStore } from '../../stores/queryStore';

describe('Sort Columns', () => {
  let component;
  let model;
  let spy;
  let mockData;
  let mockStore;

  class MockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return mockData;
    }

    getSelectedMetricCount() {
      return this.data.metricCount;
    }
  }

  beforeEach(done => {
    mockData = {};
    model = {
      data: {
        columnId: 'colOne',
        columnLabel: 'Column One'
      }
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/sort-column/index'))
      .inView(`
        <sort-column
          data.bind="data"
          column-id.two-way="data.columnId"
          column-label.two-way="data.columnLabel"
          column-data-type.two-way="data.columnDataType"
          column-read-only.two-way="data.columnReadOnly"></sort-column>
      `)
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerSingleton(QueryStore, MockStore);
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  afterEach(() => component.dispose());

  it('should set itself to undefined for updates to other columns', (done) => {
    component.viewModel.queryStore.data = {
      sortedColumnId: 'bob',
      sortDirection: SortState.sortedDescending
    };
    setImmediate(() => {
      expect(component.viewModel.sortState).toBeUndefined();
      done();
    });
  });

  it('should set direction if column id matches', (done) => {
    component.viewModel.queryStore.data = {
      sortedColumnId: 'colOne',
      sortDirection: 'desc'
    };
    setImmediate(() => {
      expect(component.viewModel.sortState).toEqual(SortState.sortedDescending);
      done();
    });
  });

  it('is sortable if the type is numeric and there is one metric selected', (done) => {
    model.data = {
      columnId: '2017',
      columnLabel: '2017',
      columnDataType: 'numeric'
    };
    component.viewModel.queryStore.data = {
      metricCount: 1
    };
    setImmediate(() => {
      expect(component.viewModel.sortable).toBeTruthy();
      done();
    });
  });

  it('is not sortable if the type is numeric and there are multiple metrics selected', (done) => {
    model.data = {
      columnId: '2017',
      columnLabel: '2017',
      columnDataType: 'numeric'
    };
    component.viewModel.queryStore.data = {
      metricCount: 2
    };
    setImmediate(() => {
      expect(component.viewModel.sortable).toBeFalsy();
      done();
    });
  });

  it('is not aggregable if the type is numeric', (done) => {
    model.data = {
      columnId: '2017',
      columnLabel: '2017',
      columnDataType: 'numeric'
    };
    setImmediate(() => {
      expect(component.viewModel.aggregable).toBeFalsy();
      done();
    });
  });

  it('is not aggregable if it is read only', (done) => {
    model.data = {
      columnId: 'dataset',
      columnLabel: 'Dataset',
      columnReadOnly: true
    };
    setImmediate(() => {
      expect(component.viewModel.aggregable).toBeFalsy();
      done();
    });
  });

  it('is aggregable if it is not read only nor numeric', (done) => {
    debugger;
    model.data = {
      columnId: 'region',
      columnLabel: 'Region'
    };
    setImmediate(() => {
      expect(component.viewModel.aggregable).toBeTruthy();
      done();
    });
  });
});
