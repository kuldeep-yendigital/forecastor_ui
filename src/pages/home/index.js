import {AuthStore} from '../../stores/authStore';
import {TaxonomyStore} from '../../stores/taxonomyStore';
import {BookmarkStore} from '../../stores/bookmarkStore';
import {SelectionStore} from '../../stores/selectionStore';
import {AnalyticsService} from '../../services/analyticsService';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from '../../events';

import {bindable, inject} from 'aurelia-framework';

export const ANALYTICS = AnalyticsService.register({
  INTERCOM_SHOW: 'intercom_show',
  INTERCOM_HIDE: 'intercom_hide'
});

const bootIntercom   = (intercom, id, user) =>
  intercom('boot', {
    app_id: id,
    name: user.name,
    email: user.email,
    company_name: user.company
  });

export class Home {
  @bindable taxonomy;
  @bindable showLanding = true;
  @bindable numberOfSelectRecords;

  static inject() {
    return [AuthStore, TaxonomyStore, BookmarkStore, SelectionStore, AnalyticsService, EventAggregator];
  }

  constructor(authStore, taxonomyStore, bookmarkStore, selectionStore, analyticsService, eventAggregator) {
    this.authStore = authStore;
    this.taxonomyStore = taxonomyStore;

    // Loads the bookmark store to trigger storage of
    // temporary bookmarks
    this.selectionStore = selectionStore;
    this.selectionStore.subscribe(this.updateNumberOfSelectedRecords.bind(this));
    this.bookmarkStore = bookmarkStore;

    this.analyticsService = analyticsService;
    this.onIntercomShow = this.onIntercomShow.bind(this);
    this.onIntercomHide = this.onIntercomHide.bind(this);

    this.ea = eventAggregator;
    this.ea.subscribe(GLOBAL_EVENTS.TOGGLE_GRID_LANDING_PAGE, this.onToggleGridLandingPage.bind(this));
  }

  updateNumberOfSelectedRecords() {
    this.numberOfSelectRecords = this.selectionStore.data.records.length;
  }

  onToggleGridLandingPage(show) {
    this.showLanding = show;
  }

  onIntercomShow() {
    this.analyticsService.pushEvent(ANALYTICS.INTERCOM_SHOW);
  }

  onIntercomHide() {
    this.analyticsService.pushEvent(ANALYTICS.INTERCOM_HIDE);
  }

  attached() {
    this.initializeIntercom();
    this.ea.publish(GLOBAL_EVENTS.SHOW_COOKIE_BANNER);
  }

  initializeIntercom() {
    if (window.Intercom && this.authStore.data.user) {
      bootIntercom(window.Intercom, window.config.intercomId, this.authStore.data.user);
      window.Intercom('onShow', this.onIntercomShow);
      window.Intercom('onHide', this.onIntercomHide);
    }
  }
}
