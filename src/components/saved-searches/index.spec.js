import {StageComponent} from 'aurelia-testing';
import * as GLOBAL_EVENTS from './../../events';
import {bootstrap} from 'aurelia-bootstrapper';

describe('Saved searches', () => {
  let component;
  let model;
  let mockedSearches = [{"created":"Fri Nov 10 2017 11:53:29 GMT+0000 (UTC)","description":"","hash":"YNJg9n0GGcSQI9jx0nIpdTBmiDi10Tp","payload":{"query":{"filters":{},"compositeFilters":{"metric":["Subscriptions"]},"range":{"start":1420070400000,"end":1672444800000,"interval":"yearly"},"sortedColumnId":"geographylevel1","sortDirection":"asc","columnKeys":["geographylevel1","geographylevel2","serviceslevel1","dataset","metriclevel1","metriclevel2","metricindicator","currency","unit"]}},"title":"Europe","type":"saved","userId":"auth0|f44b08a20bccf1c68aa3ac5b2d7cab1a"},{"created":"Fri Nov 10 2017 11:11:08 GMT+0000 (UTC)","description":"","hash":"Y0mLYM3iqOw1jjKHpz4054lYsBHqQ4J","payload":{"query":{"filters":{},"compositeFilters":{"metric":["Subscriptions","Advertising Revenues","Call Revenues","Data Revenue % of Service Revenue","Non SMS Data Revenue % of Total Data Revenue","Service Revenues","Subscription Revenues","Total Revenue"]},"range":{"start":1420070400000,"end":1672444800000,"interval":"yearly"},"sortedColumnId":"geographylevel1","sortDirection":"asc","columnKeys":["geographylevel1","geographylevel2","serviceslevel1","dataset","metriclevel1","metriclevel2","metricindicator","currency","unit"]}},"title":"America","type":"saved","userId":"auth0|f44b08a20bccf1c68aa3ac5b2d7cab1a"}]
 
  beforeEach(done => {
    model = {
      setDialogType: () => { },
      selectModel: {},
      callback: () => { },
      mockedSearches
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/saved-searches/index'))
      .inView('<saved-searches searches.bind="mockedSearches"></saved-searches>')
      .boundTo(model);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
    });

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('saved search list', () => {
    it('displays filter if the title is set', (done) => {
      component.viewModel.title = 'Test';

      setImmediate(() => {
        expect(document.querySelector('[data-selector=search-panel-input]')).toBeTruthy();
        done();
      });
    });

    it('can hide filter', (done) => {
      component.viewModel.displayFilter = false;

      setImmediate(() => {
        expect(document.querySelector('[data-selector=search-panel-input]')).toBeFalsy();
        done();
      });
    });

    it('can set header text', (done) => {
      expect(document.querySelector('.search-list-title')).toBeFalsy();

      component.viewModel.title = 'Another title';

      setImmediate(() => {
        expect(document.querySelector('.search-list-title').textContent).toEqual('Another title');
        done();
      });
    });

    it('can disable delete search', (done) => {
      expect(document.querySelectorAll('[data-selector=saved-search-delete]').length).toEqual(mockedSearches.length);

      component.viewModel.disableDelete = true;

      setImmediate(() => {
        expect(document.querySelectorAll('[data-selector=saved-search-delete]').length).toEqual(0);
        done();
      });
    });

    it('can disable save current search message', (done) => {
      expect(document.querySelector('[data-selector=no-search-results]').textContent.trim()).toContain('Click here to save the current one!');

      component.viewModel.displaySaveCurrentSearchMessage = false;

      setImmediate(() => {
        expect(document.querySelector('[data-selector=no-search-results]').textContent.trim()).not.toContain('Click here to save the current one!');
        done();
      });
    });

    it('filter search on keyup', () => {
      const event = {srcElement: {value: 'A'}};
      let filterSearch = Object.assign([], mockedSearches);
      filterSearch = filterSearch.filter(s => s.title !== 'Europe');
      component.viewModel.onKeyUp(event);
      expect(component.viewModel.filteredSearch).toBeTruthy();
      expect(component.viewModel.filteredSearches).toEqual(filterSearch)
    });

    it('filter search result removed when no search', () => {
      const event = {srcElement: {value: ''}};
      component.viewModel.onKeyUp(event);
      expect(component.viewModel.filteredSearch).toBeFalsy();
    });

    it('display no results when no search are found for filtered results', () => {
      const event = {srcElement: {value: '1'}};
      component.viewModel.onKeyUp(event);
      expect(component.viewModel.filteredSearch).toBeTruthy();
      expect(document.querySelectorAll('[data-selector=no-filter-search-results]').length).toEqual(1)
    });

    it('display no search results when no search are saved', () => {
      expect(document.querySelectorAll('[data-selector=no-search-results]').length).toEqual(1)
    });
  });

  describe('saved search event handlers', () => {

    it('should save bookmark when save button is clicked', () => {
      const saveSearchSpy = spyOn(component.viewModel, 'saveSearch');
      const element = document.querySelector('[data-selector=save-search]')
      element.click();
      expect(saveSearchSpy).toHaveBeenCalled();
    });

    it('should open bookmark when title is clicked', () => {
      const publishSpy = spyOn(component.viewModel.ea, 'publish');
      const onSearchClickSpy = spyOn(component.viewModel, 'onSearchClick');
      component.viewModel.openSavedSearch(mockedSearches[0])
      expect(publishSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, mockedSearches[0].title);
      expect(publishSpy).toHaveBeenCalledWith(GLOBAL_EVENTS.RESET_SEARCH_RESULTS);
      expect(onSearchClickSpy).toHaveBeenCalledWith(mockedSearches[0]);
    });
    
  });
});
