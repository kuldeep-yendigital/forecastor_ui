import Store from './store';
import { inject } from 'aurelia-framework';
import {QueryStore} from './queryStore';
import {ColumnStore} from './columnStore';
import {HashStateStore} from './hashStateStore';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

export const EVENTS = {
  CREATE_BOOKMARK         : 'create_bookmark',
  FETCH_CATEGORIES        : 'fetch_categories',
  CREATE_CATEGORY         : 'create_category',
  DELETE_CATEGORY         : 'delete_category',
  FETCH_SUBCATEGORIES     : 'fetch_subcategories',
  UPDATE_EDIT_CATEGORY    : 'update_edit_category',
  UPDATE_CATEGORY         : 'update_category',
  UPDATE_HASH             :  'update_hash',
  UPDATE_SUBCATEGORY      : 'update_subcategory',
  CREATE_BOOKMARK_SUCCESS : 'create_bookmark_success',
  DELETE_BOOKMARK         : 'delete_bookmark',
  FETCH_BOOKMARKS         : 'fetch_bookmarks',
  FETCH_POPULAR_BOOKMARKS : 'fetch_popular_bookmarks',
  CREATE_SUBCATEGORY      : 'create_subcategory',
  EDIT_SUBCATEGORY        : 'edit_subcategory',
  DELETE_SUBCATEGORY      : 'delete_subcategory',
  FETCH_BOOKMARKS_DONE    : 'fetch_bookmarks_done',
  DELETE_POPULAR_BOOKMARK : 'delete_popular_bookmark'
};

export const TYPES = {
  SHARED    : 'shared',
  SAVED     : 'saved',
  TEMPORARY : 'temporary'
};

@inject(config)
export class BookmarkStore extends Store {

  get EVENTS() {
    return [
      EVENTS.FETCH_CATEGORIES,
      EVENTS.CREATE_BOOKMARK,
      EVENTS.FETCH_SUBCATEGORIES,
      EVENTS.CREATE_CATEGORY,
      EVENTS.DELETE_CATEGORY,
      EVENTS.UPDATE_CATEGORY,
      EVENTS.UPDATE_EDIT_CATEGORY,
      EVENTS.UPDATE_HASH,
      EVENTS.UPDATE_SUBCATEGORY,
      EVENTS.DELETE_BOOKMARK,
      EVENTS.FETCH_BOOKMARKS,
      EVENTS.FETCH_POPULAR_BOOKMARKS,
      EVENTS.CREATE_SUBCATEGORY,
      EVENTS.EDIT_SUBCATEGORY,
      EVENTS.DELETE_SUBCATEGORY,
      EVENTS.FETCH_BOOKMARKS_DONE,
      EVENTS.DELETE_POPULAR_BOOKMARK
    ];
  }

  get STORES() {
    return [
      HashStateStore,
      QueryStore,
      ColumnStore
    ];
  }

  constructor(config, ...rest) {
    super(...rest);
    this.host = config.bookmarkApiUrl;

    // Store the default state of the stores for bookmarking
    // this is done at construction time, i.e. before any
    // events are fired and before hash state has been triggered
    // by the router so that we guarantee the state is not
    // affected by state in the hash state store.
    this.defaultState = this.getCurrentBookmark();
    this.bookmark = this.defaultState;
  }

  getDefaultState() {
    return {};
  }

  name = () => 'bookmarks';

  loadBookmarks = () => this._loadBookmarks(TYPES.SAVED, '');

  loadPopularBookmarks = () => this._loadBookmarks('popular', 'popular');

  _loadBookmarks(key, url) {
    this.refresh({ isLoading : true });

    this.service.fetchFrom('bookmarkApiUrl', url)
      .then(response => {
        this.refresh({ [key]: response, isLoading : false });
        this.publish(EVENTS.FETCH_BOOKMARKS_DONE, (key === 'popular'));
      })
      .catch(error => {
        console.error(error);
        this.refresh({ isLoading : false });
      });
  }

  createBookmark(data) {
    this.refresh({ isLoading : true });

    this.service.fetch(`${this.host}/`, { method : 'POST', body : JSON.stringify(data)})
      .then((bookmark) => {
        if (bookmark.type === TYPES.SAVED) {
          this.refresh({
            [TYPES.SAVED] : [ bookmark ].concat(this.data[TYPES.SAVED]),
            isLoading     : false
          });
        } else {
          this.refresh({ isLoading : false });
        }

        this.publish(EVENTS.CREATE_BOOKMARK_SUCCESS, bookmark);
      })
      .catch(error => console.error(error));
  }

  deleteBookmark(hash) {
    this.service.fetch(`${this.host}/${hash}`, { method: 'DELETE' })
      .then(() => {
        this.refresh({
          saved: this.data.saved.filter(bookmark => bookmark.hash !== hash)
        });
      })
      .catch(error => console.error(error));
  }

  deletePopularBookmark(params) {
    const { id, hash, parentid } = params;
    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/hash/${id}`, { method: 'DELETE' })
      .then(() => {
        return this.fetchCategories();
      })
      .then(() => {
        return this.fetchSubcategories(parentid);
      })
      .catch(error => console.error(error));
  }

  fetchCategories() {
    this.refresh({ isLoading : true });

    this.service.fetchFrom('bookmarkCategoriesApiUrl', 'categories')
      .then(response => {
        this.refresh({ categories: response, isLoading : false });
      })
      .catch(error => {
        console.error(error);
        this.refresh({ isLoading : false });
      });
  }


  createCategory(payload) {
    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/category`, { method: 'POST', body : JSON.stringify(payload)} )
      .then((result) => {
        this.fetchCategories();
      })
      .catch(error => console.error(error))
  }

  updateEditCategory({ id, newData }) {
    const category = this.data.categories.find(cat => cat.id === id);

    const payload = {
      ...category,
      title: newData.title,
      sku: newData.sku
    };

    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
      .then(() => {
        this.fetchCategories();
      })
      .catch(err => console.log(err));
  }

  updateCategory({ order }) {
    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/category/reorder`, { method: 'PUT', body : JSON.stringify({ newOrder: order })})
      .then((result) => {
        console.log(result);
      })
      .catch(error => console.error(error));
  }

  updateHash({ isFromAll, newSubCatId, addedItem, replacedHash }) {
    // Create hash in db
    if(isFromAll) {
      const fetchOpt = {
        method: 'POST',
        body: JSON.stringify({
          subcategory_id: newSubCatId,
          hash: addedItem.hash,
          replacedHash,
        }),
      };

      this.service.fetch(`${config.bookmarkCategoriesApiUrl}/hash`, fetchOpt)
      .then((result) => {
        this.fetchCategories();
      })
      .catch(error => console.error(error))
    }
  }

  deleteCategory(id) {
    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/category/${id}`, { method: 'DELETE' } )
      .then((result) => {
        this.fetchCategories();
      })
      .catch(error => console.error(error))
  }

  createSubcategory(data) {
    const options = {
      method: 'POST',
      body: JSON.stringify(data)
    };

    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/subcategory`, options)
      .then(() => {
        return this.fetchCategories();
      })
      .then(() => {
        return this.fetchSubcategories(data.parentid);
      })
      .catch(error => console.error(error));
  }

  deleteSubcategory([id, parentid]) {
    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/subcategory/${id}`, { method: 'DELETE' })
      .then(() => {
        return this.fetchCategories();
      })
      .then(() => {
        return this.fetchSubcategories(parentid);
      })
      .catch(error => console.error(error));
  }

  editSubcategory({ id, newData }) {
    const subcategory = this.data.subcategories.find(cat => cat.id === id);

    const payload = {
      ...subcategory,
      title: newData.title
    };

    this.service.fetch(`${config.bookmarkCategoriesApiUrl}/subcategory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
      .then(() => {
        return this.fetchCategories();
      })
      .then(() => {
        return this.fetchSubcategories(subcategory.category_id);
      })
      .catch(err => console.log(err));
  }

  fetchSubcategories(id) {
    this.refresh({ isLoading : true });

    this.service.fetchFrom('bookmarkCategoriesApiUrl', `subcategories?category_id=${id}`)
      .then(subcategoriesArr => {
        this.refresh({ subcategories: subcategoriesArr, isLoading : false });
      })
      .catch(error => {
        console.error(error);
        this.refresh({ isLoading : false });
      });
  }

  onEvent(data, event) {
    switch (event) {
    case EVENTS.FETCH_BOOKMARKS:
      this.loadBookmarks();
      break;
    case EVENTS.FETCH_CATEGORIES:
      this.fetchCategories();
      break;
    case EVENTS.UPDATE_CATEGORY:
      this.updateCategory(data);
      break;
    case EVENTS.UPDATE_EDIT_CATEGORY:
      this.updateEditCategory(data);
      break;
    case EVENTS.CREATE_CATEGORY:
      this.createCategory(data);
      break;
    case EVENTS.UPDATE_HASH:
      this.updateHash(data);
      break;
    case EVENTS.DELETE_CATEGORY:
      this.deleteCategory(data);
      break;
    case EVENTS.FETCH_SUBCATEGORIES:
      this.fetchSubcategories(data);
      break;
    case EVENTS.FETCH_POPULAR_BOOKMARKS:
      this.loadPopularBookmarks();
      break;
    case EVENTS.CREATE_BOOKMARK:
      this.createBookmark({
        payload: this.bookmark,
        ...data
      });
      break;
    case EVENTS.DELETE_BOOKMARK:
      this.deleteBookmark(data);
      break;
    case EVENTS.CREATE_SUBCATEGORY:
      this.createSubcategory(data);
      break;
    case EVENTS.DELETE_SUBCATEGORY:
      this.deleteSubcategory(data);
      break;
    case EVENTS.EDIT_SUBCATEGORY:
      this.editSubcategory(data);
      break;
    case EVENTS.DELETE_POPULAR_BOOKMARK:
      this.deletePopularBookmark(data);
      break;
    }
  }

  updateCurrentBookmark(data) {

    const bookmark = { ...this.bookmark, ...data };

    // Only update the bookmark if it has changed, here we
    // perform a deep equality check.
    if (!isEqual(bookmark, this.bookmark)) {
      this.createBookmark({
        type: TYPES.TEMPORARY,
        title: Date.now().toString(),
        description: '',
        payload: bookmark
      });
    }

    this.bookmark = bookmark;
  }

  onStoreChange(data, store) {
    switch (store) {

    // The hash in the query updates and the state associated
    // to this hash is loaded. We want the current bookmark to
    // represent this state but we do not need to create a
    // new bookmark.
    case HashStateStore:

      // The HashStateStore sends empty state if the route isn't
      // the grid or there is no hash in the URL (i.e. default grid view).
      if (isEmpty(data)) {
        this.bookmark = this.defaultState;
      } else {
        this.bookmark = cloneDeep(data);
      }
      break;

    // Here is where we listen out for stores for which we want to
    // persist state in our bookmarks. The stores will need to
    // listen out to the HashStateStore for state updates when the
    // URL changes.
    case ColumnStore:
    case QueryStore:
      this.updateCurrentBookmark(this.getCurrentBookmark());
      break;
    }
  }

  getCurrentBookmark() {
    return {
      query: cloneDeep(this.stores.QueryStore.data),
      pinned: cloneDeep(this.stores.ColumnStore.data.pinned),
      readOnly: this.stores.ColumnStore.data.columns
        .filter(el => el.readOnly === true)
        .map(el => el.key)
    };
  }
}
