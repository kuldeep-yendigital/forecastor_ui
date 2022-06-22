/* global describe, it, expect, beforeEach, spyOn */
import { EventAggregator } from 'aurelia-event-aggregator';
import DataService from './dataService';

const pkg = require('./../../package.json');

describe(`${pkg.name}/src/services/dataService`, () => {
  const query         = { sortedColumnId: 'geographylevel1', sortDirection: 'desc' };
  const columnKeys    = [ 'geographylevel1' ];
  const pinnedColumns = [ 'companyname' ];

  const fakeConfig     = { get: () => 'url' };
  const requestWrapper = { fetch: () => Promise.resolve("{}") };

  let request;
  let service;
  let spy;

  beforeEach(() => {
    request = {
      body    : JSON.stringify({
        query      : query,
        page_size  : 200,
        pinned     : [],
        fields     : columnKeys,
        sort_field : { direction : 'desc', type : 'dimension_sort', value: 'geographylevel1' },
        timeframe_interval: 'yearly'
      }),
      method  : 'POST',
      headers : {}
    };

    service = new DataService(
      EventAggregator,
      fakeConfig,
      requestWrapper
    );

    spy = spyOn(requestWrapper, 'fetch').and.callThrough();
  });

  describe('#excel', () => {
    it('Should make an http request to the export api.', (done) => {
      request.headers = { 'Accept' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

      service.excel(query, columnKeys)
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });
  });

  describe('#export', () => {
    it('Should make an http request to the export api.', (done) => {
      service.export(query, columnKeys)
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });
  });

  describe('#fetch', () => {
    it('Should make an http request to the data api.', (done) => {
      service.fetch(query, columnKeys)
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });
  });

  describe('#innerFetch', () => {
    it('Should make an http request to a given url.', (done) => {
      service.innerFetch({ columnKeys, query, url : fakeConfig.get() })
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });

    it('Should return a Promise.reject if no "columnKeys" parameter was given.', (done) => {
      service.innerFetch({ query, url : fakeConfig.get() })
        .catch(err => expect(err).toEqual('Missing parameter "columnKeys".'))
        .then(() => done());
    });

    it('Should return a Promise.reject if no "query" parameter was given.', (done) => {
      service.innerFetch({ columnKeys, url : fakeConfig.get() })
        .catch(err => expect(err).toEqual('Missing parameter "query".'))
        .then(() => done());
    });

    it('Should return a Promise.reject if no "url" parameter was given.', (done) => {
      service.innerFetch({ columnKeys, query })
        .catch(err => expect(err).toEqual('Missing parameter "url".'))
        .then(() => done());
    });

    it('Should default to "dimension_sort" in "asc" order using the 1st column as a value.', (done) => {
      request.body = JSON.parse(request.body);
      request.body.query = {};
      request.body.sort_field = { direction : 'asc', type : 'dimension_sort', value : columnKeys[0] };
      request.body = JSON.stringify(request.body);

      service.innerFetch({ columnKeys, query: {}, url : fakeConfig.get() })
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });

    it('Should use "value_sort" if "sortedColumnId" represents a date value.', (done) => {
      request.body = JSON.parse(request.body);
      request.body.query = { sortDirection  : 'desc', sortedColumnId : '31/12/2000' };
      request.body.sort_field = { direction : 'desc', type : 'value_sort', value : '31/12/2000' };
      request.body = JSON.stringify(request.body);

      service.innerFetch({ columnKeys, query: {
        sortDirection  : 'desc', sortedColumnId : '31/12/2000'
      }, url : fakeConfig.get() })
        .then(() => expect(spy).toHaveBeenCalledWith('url', request))
        .then(() => done());
    });
  });
});
