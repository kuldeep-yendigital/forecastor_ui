import {QueryStore} from './queryStore';
import {ColumnStore} from './columnStore';
import {DataStore} from './dataStore';
import {Container} from 'aurelia-dependency-injection';
import {FakeDataService} from '../../test/unit/helpers/fakes';

import MockStore, {BindingEngineMock, EventAggregatorMock, GenericServiceMock} from '../../test/unit/helpers/mock-store';

describe('DataStore', () => {

  let queryStoreMock, dataStore;
  let queryStoreMockData;
  let columnStoreMockData;

  beforeEach(() => {
    queryStoreMockData = {
      filters: {},
      compositeFilters: {}
    };
    columnStoreMockData = {};
    let container = new Container().makeGlobal();

    container.registerInstance(QueryStore, new MockStore(null, queryStoreMockData));
    container.registerInstance(ColumnStore, new MockStore(null, queryStoreMockData));

    dataStore = new DataStore(new FakeDataService(), BindingEngineMock, EventAggregatorMock);
  });

  // describe('Query Store Updated', () => {
  //   it('should update dataStore', (done) => {
  //     expect(dataStore.data.isUpdating).toBeTruthy();
  //     dataStore.onStoreChange(queryStoreMockData, QueryStore);
  //     expect(dataStore.data.isUpdating).toBeTruthy();
  //     setImmediate(() => {
  //       expect(dataStore.data.isUpdating).toBeFalsy();
  //       done();
  //     });
  //   });
  // });
});
