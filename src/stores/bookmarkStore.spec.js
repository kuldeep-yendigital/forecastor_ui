import {EVENTS, BookmarkStore} from './bookmarkStore';
import {GenericService} from '../services/genericService';
import {Container} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FakeBindingEngine, FakeEventAggregator} from '../../test/unit/helpers/fakes';
import {QueryStore} from "./queryStore";
import {ColumnStore} from "./columnStore";
import {HashStateStore} from "./hashStateStore";
import MockStore from "../../test/unit/helpers/mock-store";

describe('Bookmark Store', () => {

  const defaultBookmarkApiUrl = 'https://forecaster-api.dev.tmt.informa-labs.com/bookmark';

  let container;

  beforeEach(() => {
    window.config.bookmarkApiUrl = defaultBookmarkApiUrl;
    container = new Container().makeGlobal();
    container.registerInstance(BindingEngine, new FakeBindingEngine());
    container.registerInstance(EventAggregator, new FakeEventAggregator());
    container.registerInstance(HashStateStore, {
      data: {}
    });
    container.registerInstance(QueryStore, {
      data: {}
    });
    container.registerInstance(ColumnStore, {
      data: {}
    });
    container.registerInstance(GenericService, {
      fetchFrom: () => {},
      fetch: () => {}
    });
  });

  it('is empty by default', () => {
    const bookmarkStore = container.get(BookmarkStore);
    expect(bookmarkStore.data.saved).toBeUndefined();
  })

  it('fetches the users bookmarks', () => {
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetchFrom').and.returnValue(Promise.resolve([]))
    bookmarkStore.onEvent(null, EVENTS.FETCH_BOOKMARKS);
    expect(genericService.fetchFrom).toHaveBeenCalledWith('bookmarkApiUrl', '');
  });

  it('fetches popular bookmarks', () => {
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetchFrom').and.returnValue(Promise.resolve([]))
    bookmarkStore.onEvent(null, EVENTS.FETCH_POPULAR_BOOKMARKS);
    expect(genericService.fetchFrom).toHaveBeenCalledWith('bookmarkApiUrl', 'popular');
  });

  it('populates itself with bookmarks received from the service', done => {
    const bookmarks = [
      {}, {}, {}
    ];
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetchFrom').and.returnValue(Promise.resolve(bookmarks))
    bookmarkStore.onEvent(null, EVENTS.FETCH_BOOKMARKS);
    setTimeout(() => {
      expect(bookmarkStore.data.saved).toEqual(bookmarks);
      done();
    });
  });

  it('populates itself with popular bookmarks received from the service', done => {
    const bookmarks = [
      {}, {}, {}
    ];
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetchFrom').and.returnValue(Promise.resolve(bookmarks))
    bookmarkStore.onEvent(null, EVENTS.FETCH_POPULAR_BOOKMARKS);
    setTimeout(() => {
      expect(bookmarkStore.data.popular).toEqual(bookmarks);
      done();
    });
  });

  it('handles creation of user bookmarks', () => {
    const bookmark = {
      title: 'bob',
      description: 'bob likes bookmarks',
      type: 'saved'
    };
    const query = {
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    const pinned = ['geographylevel1'];
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    const bookmarkStore = container.get(BookmarkStore);
    bookmarkStore.bookmark = {
      query,
      pinned
    };
    bookmarkStore.onEvent(bookmark, EVENTS.CREATE_BOOKMARK);
    expect(genericService.fetch).toHaveBeenCalled();
    const args = genericService.fetch.calls.argsFor(0);
    expect(args[0]).toBe(`${defaultBookmarkApiUrl}/`);
    expect(args[1].method).toBe('POST');
    expect(JSON.parse(args[1].body)).toEqual({
      ...bookmark,
      payload: {
        query,
        pinned
      }
    });
  });

  it('handles creation of user bookmarks with passed payload', () => {
    const query = {
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    const pinned = ['geographylevel1'];
    const bookmark = {
      title: 'bob',
      description: 'bob likes bookmarks',
      type: 'saved',
      payload: {
        query,
        pinned
      }
    };
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    const bookmarkStore = container.get(BookmarkStore);
    bookmarkStore.bookmark = {};
    bookmarkStore.onEvent(bookmark, EVENTS.CREATE_BOOKMARK);
    expect(genericService.fetch).toHaveBeenCalled();
    const args = genericService.fetch.calls.argsFor(0);
    expect(args[0]).toBe(`${defaultBookmarkApiUrl}/`);
    expect(args[1].method).toBe('POST');
    expect(JSON.parse(args[1].body)).toEqual({
      ...bookmark,
      payload: {
        query,
        pinned
      }
    });
  });

  it('updates itself with the newly created bookmark', done => {
    const bookmark = { type: 'saved' };
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve(bookmark));
    bookmarkStore.onEvent(bookmark, EVENTS.CREATE_BOOKMARK);
    setTimeout(() => {
      expect(bookmarkStore.data.saved[0]).toEqual(bookmark);
      done();
    });
  });

  it('handles deletion of user bookmarks', () => {
    const hash = 'abc123';
    const bookmarkStore = container.get(BookmarkStore);
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    bookmarkStore.onEvent(hash, EVENTS.DELETE_BOOKMARK);
    expect(genericService.fetch).toHaveBeenCalledWith(`${defaultBookmarkApiUrl}/${hash}`, {
      method: 'DELETE'
    });
  });

  it('updates itself omitting the deleted bookmark', done => {
    const hash = 'abc123';
    const bookmarkStore = container.get(BookmarkStore);
    bookmarkStore.data.saved = [
      { hash: 'abc123' },
      { hash: 'def456' }
    ]
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve())
    bookmarkStore.onEvent(hash, EVENTS.DELETE_BOOKMARK);
    setTimeout(() => {
      expect(bookmarkStore.data.saved).toEqual([
        { hash: 'def456' }
      ]);
      done();
    });
  });

  it('maintains a bookmarkable state of the application', () => {
    const query = {
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    const pinned = ['geographylevel1'];
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    const queryStore = container.get(QueryStore);
    const columnStore = container.get(ColumnStore);
    const bookmarkStore = container.get(BookmarkStore);
    columnStore.data = {
      pinned
    };
    bookmarkStore.onStoreChange(columnStore.data, ColumnStore);
    queryStore.data = query;
    bookmarkStore.onStoreChange(queryStore.data, QueryStore);
    expect(bookmarkStore.bookmark).toEqual({
      query,
      pinned
    });
  });

  it('creates a temporary bookmark of bookmarkable state on change', () => {
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    const queryStore = container.get(QueryStore);
    const columnStore = container.get(ColumnStore);
    queryStore.data = {
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    columnStore.data.pinned = ['geographylevel1'];
    const bookmarkStore = container.get(BookmarkStore);
    columnStore.data.pinned = ['geographylevel1', 'geographylevel2'];
    bookmarkStore.onStoreChange(columnStore.data, ColumnStore);
    expect(genericService.fetch).toHaveBeenCalled();
    const args = genericService.fetch.calls.argsFor(0);
    expect(args[0]).toBe(`${defaultBookmarkApiUrl}/`);
    expect(args[1].method).toBe('POST');
    expect(JSON.parse(args[1].body).payload).toEqual({
      query: queryStore.data,
      pinned: columnStore.data.pinned
    });
    expect(JSON.parse(args[1].body).type).toEqual('temporary');
  });

  it('does not create a temporary bookmark if there are no differences', () => {
    const genericService = container.get(GenericService);
    spyOn(genericService, 'fetch').and.returnValue(Promise.resolve({}));
    const queryStore = container.get(QueryStore);
    const columnStore = container.get(ColumnStore);
    queryStore.data = {
      compositeFilters: {
        metric: ['Subscriptions']
      }
    };
    columnStore.data.pinned = ['geographylevel1'];
    const bookmarkStore = container.get(BookmarkStore);
    bookmarkStore.bookmark = {
      query: {
        compositeFilters: {
          metric: ['Subscriptions']
        }
      },
      pinned: ['geographylevel1']
    }
    bookmarkStore.onStoreChange(columnStore.data, ColumnStore);
    expect(genericService.fetch).not.toHaveBeenCalled();
  });
});
