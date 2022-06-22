import { BookmarkStore, EVENTS as BOOKMARK_EVENTS, TYPES as BOOKMARK_TYPES } from './../../stores/bookmarkStore';
import { DashboardStore, EVENTS as DASHBOARD_EVENTS } from '../../stores/dashboardStore';
import { Clipboard } from './../../helpers/clipboard';
import { AuthStore } from '../../stores/authStore';
import { Clipboard as ClipboardDialog } from './../../components/dialog/clipboard/';
import InputTextDialog from './../../components/dialog/input-text';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { StoreComponent } from './../../components/store-component';
import { Router } from 'aurelia-router';
import { ProductStore, EVENTS as PRODUCT_EVENTS } from '../../stores/productStore';
import { startTour } from './../../tour/helpers';
import { inject, bindable } from 'aurelia-framework';
import * as GLOBAL_EVENTS from './../../events';
import { debug } from 'util';
import('./dashboard.scss');
import find from 'lodash/find';
import filter from 'lodash/filter';
import Sortable from 'sortablejs';

export class Dashboard extends StoreComponent {
  @bindable activecategory = 0;

  static inject() {
    return [
      EventAggregator,
      DialogController,
      DialogService,
      BookmarkStore,
      AuthStore,
      DashboardStore,
      Router,
      ProductStore,
      'config'
    ];
  }

  constructor(
    eventAggregator,
    dialogController,
    dialogService,
    bookmarkStore,
    authStore,
    dashboardStore,
    router,
    productStore,
    config
  ) {
    super([bookmarkStore, productStore], eventAggregator);

    this.bookmark      = {};
    this.config        = config;
    this.controller    = dialogController;
    this.authStore     = authStore;
    this.dialogService = dialogService;
    this.open          = this.open.bind(this);
    this.router        = router;

    this.onCreateBookmarkSuccess = this.onCreateBookmarkSuccess.bind(this);
  }

  activate(params, routeConfig) {
    this.publish(BOOKMARK_EVENTS.FETCH_BOOKMARKS);
    this.publish(BOOKMARK_EVENTS.FETCH_POPULAR_BOOKMARKS);
    this.publish(DASHBOARD_EVENTS.FETCH_DASHBOARD);
    this.publish(BOOKMARK_EVENTS.FETCH_CATEGORIES);

    if (this.showSubscriptions())
      this.publish(PRODUCT_EVENTS.FETCH_SUITES);

    if (params.hasOwnProperty('tour') && 'start' === params.tour)
      this.tour();

    this.subscribe(BOOKMARK_EVENTS.FETCH_BOOKMARKS_DONE, this.fetchBookmarksDone.bind(this));
  }

  attached() {
    super.attached();
    this.subscribe(BOOKMARK_EVENTS.CREATE_BOOKMARK_SUCCESS, this.onCreateBookmarkSuccess);
    this.eventAggregator.publish(GLOBAL_EVENTS.SHOW_COOKIE_BANNER);
    // const isAdmin = ['0053L000000bwljQAA', '0053L000000baJsQAI', '0053L000000baJsQAI']
    //   .includes(this.authStore.data.user.salesforceUserId);

    // if(isAdmin) {
      // this.isAdmin = true;
      // this.setupSortables();
    // }
  }

  fetchBookmarksDone(isPopular) {
    // if (isPopular) {
    //   const activeCat = find(this.data.bookmarks.categories, (cat) => {
    //     return cat.isEnabled;
    //   });
    //
    //   const categoryID = activeCat.id;
    //   this.publish(BOOKMARK_EVENTS.FETCH_SUBCATEGORIES, categoryID);
    //   this.activecategory = activeCat.id;
    // }
  }

  setupSortables() {
    // Category-list sortable config
    // Sortables are not needed for non-admins
    if (this.isAdmin) {
      Sortable.create(document.getElementById('category-list'), {
        animation: 100,
        onUpdate: (evt) => {
          // Construct the new order of the ids
          const listorder = filter(evt.target.childNodes, { nodeName: 'LI' });
          const orderArray = listorder.map((item) => {
            return item.dataset.categoryid;
          });
  
          const payload = {
            order: orderArray.join(',')
          };
  
          this.publish(BOOKMARK_EVENTS.UPDATE_CATEGORY, payload);
        }
      });
    }
  }

  showSubscriptions() {
    return this.config.get('dashboard').showSubscriptions || false;
  }

  deleteCategory({ id }) {
    this.publish(BOOKMARK_EVENTS.DELETE_CATEGORY, id);
  }

  tour() {
    startTour(true);
  }

  addCategory() {
    this.dialogService.open({
      viewModel : InputTextDialog,
      model     : {
        inputs: [
          { text    : 'Please enter the category name:', value: '' },
          { text    : 'Enter skus', value: '' }
        ],
        onSubmit: (value) => this.saveCategory(value)
      }
    });
  }

  saveCategory([ title, sku ]) {
    this.publish(BOOKMARK_EVENTS.CREATE_CATEGORY, { title, sku });
  }

  editCategory({id, sku, title}) {
    this.dialogService.open({
      viewModel: InputTextDialog,
      model: {
        inputs: [
          { text: 'Category Name', value: title },
          { text: 'SKUs', value: sku }
        ],
        id: id,
        onSubmit: (value) => this.updateCategory(value)
      }
    });
  }

  updateCategory([ title, sku, id ]) {
    this.publish(BOOKMARK_EVENTS.UPDATE_EDIT_CATEGORY,  { id: id, newData: { title, sku }});
  }

  navigateSubcategory(item) {
    const categoryID = item.id;
    this.publish(BOOKMARK_EVENTS.FETCH_SUBCATEGORIES, categoryID);
    this.activecategory = item.id;
  }

  toUniqueRankedProductList = (suites) => {
    return suites.reduce((acc, suite) => {
      suite.products.forEach((product) => {
        if (-1 >= acc.indexOf(product)) acc.push(product);
      });
      return acc;
    }, []).sort((a, b) => {
      if (a.rank < b.rank) return -1;
      if (a.rank > b.rank) return 1;
      return 0;
    }).map((product) => product.name);
  }

  onCreateBookmarkSuccess(bookmark) {
    if (bookmark.type === BOOKMARK_TYPES.SHARED) {
      this.dialogService.open({
        viewModel : ClipboardDialog,
        model     : {
          message : 'The URL has been copied to your clipboard',
          text    : 'Your sharable URL:',
          value   : this.router.urlFor.grid({ s : `${bookmark.type}-${bookmark.hash}` })
        }
      });
    }
  }

  open(search) {
    this.router.navigateTo.grid({ s: `${search.type}-${search.hash}` });
  }
}
