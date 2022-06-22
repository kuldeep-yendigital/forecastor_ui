import { AuthStore, EVENTS as AUTH_EVENTS } from '../../stores/authStore';
import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import ('./index.scss');

@inject(EventAggregator, AuthStore, Router)
export class NavHeader {
  @bindable isGrid;
  @bindable inLandingMode;

  constructor(eventAggregator, authStore, router) {
    this.authStore = authStore;
    this.eventAggregator = eventAggregator;
    this.router = router;
    this.initialPageTrack = false;
  }

  attached() {
    this.subscriptions = [
      this.eventAggregator.subscribe('router:navigation:complete', e => {
        if (this.router.currentInstruction.config.name === e.instruction.config.name) return;
        this.adobeAnalyticsTrackPage(e);
      })
    ];

    // page track for when we first load the app
    // must be fired separately as Aurelias
    // router:navigation:complete does not always
    // fire on initial app load
    if (!this.initialPageTrack) this.adobeAnalyticsTrackPage();
  }

  detached() {
    if (this.adobeAnalyticsTImeout) {
      clearTimeout(this.adobeAnalyticsTImeout);
    }
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  adobeAnalyticsTrackPage(e, retries = 0) {
    if (window.config.envName === 'qa') {
      this.initialPageTrack = true;
      if (!window.adobe_s) {
        if (retries < 10) {
          this.adobeAnalyticsTImeout = setTimeout(() => {
            retries = retries + 1;
            this.adobeAnalyticsTrackPage(e, retries);
          }, 1000);
        }
      } else {
        window.adobe_s.clearVars();
        let routeName;
        if (e) {
          routeName = e.instruction.config.name;
        } else {
          routeName = this.router.currentInstruction.config.name;
        }

        const {
          samsAccountId,
          samsParentId,
          company,
          email,
        } = this.authStore.data.user;

        window.adobe_s.eVar8 = window.adobe_s.pageName = routeName;
        window.adobe_s.eVar13 = company;
        window.adobe_s.eVar50 = samsAccountId;
        window.adobe_s.eVar62 = 'Forecaster';
        window.adobe_s.eVar63 = samsParentId;
        window.adobe_s.eVar64 = email;

        window.adobe_s.t();
      }
    }
  }

  logout() {
    this.eventAggregator.publish(AUTH_EVENTS.LOGOUT);
  }
}
