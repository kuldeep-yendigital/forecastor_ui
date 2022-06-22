import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import Store from '../../../stores/store';
import { EVENTS as BOOKMARK_EVENTS } from './../../../stores/bookmarkStore';

describe('Save search dialog', () => {
  let component, model;

  let mockedSearches =
    [
      {
        "created": "2017-10-23 09:13:07",
        "description": "",
        "hash": "rWFiGCNAy6QpLuES8hDWqhyMjctgdL",
        "id": "b7fa86a6-7837-4d13-8161-e6b7e2475424",
        "query": {
          "filters": {},
          "compositeFilters": {
            "metric": [
              "Subscriptions"
            ]
          },
          "range": {
            "start": 1325376000000,
            "end": 1514678400000,
            "interval": "yearly"
          },
          "sortedColumnId": "geographylevel1",
          "sortDirection": "asc",
          "columnKeys": [
            "geographylevel1",
            "geographylevel2",
            "serviceslevel1",
            "dataset",
            "metriclevel1",
            "metriclevel2",
            "metricindicator",
            "currency",
            "unit"
          ]
        },
        "title": "America"
      },
      {
        "created": "2017-10-23 09:13:02",
        "description": "",
        "hash": "rWFiGCNAy6QpLuES8hDWqhyMjctgdL",
        "id": "ff157714-8c89-43c7-aca1-6437c6d4db60",
        "query": {
          "filters": {},
          "compositeFilters": {
            "metric": [
              "Subscriptions"
            ]
          },
          "range": {
            "start": 1325376000000,
            "end": 1514678400000,
            "interval": "yearly"
          },
          "sortedColumnId": "geographylevel1",
          "sortDirection": "asc",
          "columnKeys": [
            "geographylevel1",
            "geographylevel2",
            "serviceslevel1",
            "dataset",
            "metriclevel1",
            "metriclevel2",
            "metricindicator",
            "currency",
            "unit"
          ]
        },
        "title": "Middle East"
      },
      {
        "created": "2017-10-23 09:13:02",
        "description": "",
        "hash": "rWFiGCNAy6QpLuES8hDWqhyMjctgdL",
        "id": "ff157714-8c89-43c7-aca1-6437c6d4db60",
        "query": {
          "filters": {},
          "compositeFilters": {
            "metric": [
              "Subscriptions"
            ]
          },
          "range": {
            "start": 1325376000000,
            "end": 1514678400000,
            "interval": "yearly"
          },
          "sortedColumnId": "geographylevel1",
          "sortDirection": "asc",
          "columnKeys": [
            "geographylevel1",
            "geographylevel2",
            "serviceslevel1",
            "dataset",
            "metriclevel1",
            "metriclevel2",
            "metricindicator",
            "currency",
            "unit"
          ]
        },
        "title": "Europe"
      }
    ]

  class mockStore extends Store {
    get EVENTS () {
      return [];
    }

    getDefaultState () {
      return mockedSearches
    }
  }

  beforeEach(done => {
    model = {
      setDialogType: () => {
      },
      selectModel: {},
      callback: () => {
      },
      searches: []
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/dialog/save-search/index'))
      .inView('<save-search></save-search>')
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

  describe('header', () => {
    it('handles save search and cancel action', (done) => {

      const saveSearchButton = document.querySelector('[data-selector=save-search-button]');
      const saveSearchCancelButton = document.querySelector('[data-selector=save-search-button-cancel]');

      const spySetDialogType = spyOn(component.viewModel, 'setDialogType');

      saveSearchButton.click();
      expect(spySetDialogType).toHaveBeenCalledWith('save_search');

      setImmediate(() => {
        saveSearchCancelButton.click();
        expect(spySetDialogType).toHaveBeenCalledWith('search_list');
        done()
      })
    });

  });

  describe('event handlers', () => {
    it('subscribes to bookmark create success', (done) => {
      const expectedBookmark = {};
      component.viewModel.onCreateBookmarkSuccess = (bookmark) => {
        expect(bookmark).toBe(expectedBookmark);
        done();
      };
      component.viewModel.attached();

      component.viewModel.publish(BOOKMARK_EVENTS.CREATE_BOOKMARK_SUCCESS, expectedBookmark);
    });

    it('handles share button', () => {
      const shareButton = document.querySelector('[data-selector=share-button] a');
      const shareSpy = spyOn(component.viewModel, 'share');
      shareButton.click();
      expect(shareSpy).toHaveBeenCalled();
    });

    it('handles save button', () => {
      const saveButton = document.querySelector('[data-selector=form-input-submit]');
      const saveSpy = spyOn(component.viewModel, 'save');
      saveButton.click();
      expect(saveSpy).toHaveBeenCalled();
    });
  });

});
