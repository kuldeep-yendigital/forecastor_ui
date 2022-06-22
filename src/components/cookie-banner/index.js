import * as GLOBAL_EVENTS from '../../events';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable } from 'aurelia-framework';
import { Cookies } from 'aurelia-plugins-cookies';

import './index.scss';

export class CookieBanner {
  @bindable visible;

  static inject() {
    return [
      'config',
      EventAggregator
    ];
  }

  constructor(Config, EventAggregator) {
    this.config = Config;
    this.showBanner = this.showBanner.bind(this);
    this.hideBanner = this.hideBanner.bind(this);

    this.ea = EventAggregator;
    this.ea.subscribe(
      GLOBAL_EVENTS.SHOW_COOKIE_BANNER, this.showBanner
    );
    this.ea.subscribe(
      GLOBAL_EVENTS.HIDE_COOKIE_BANNER, this.hideBanner
    );
  }

  showBanner() {
    const cookieNotificationShown = Cookies.get('cookie_banner_shown');
    if (!cookieNotificationShown) {
      this.visible = true;
      Cookies.put('cookie_banner_shown', true);
    }
  }

  hideBanner() {
    Cookies.put('cookie_banner_shown', true);
    this.visible = false;
  }
}
