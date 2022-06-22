import { PLATFORM } from 'aurelia-pal';
import { Authorizer } from './authorizer';
import { AuthStore } from '../stores/authStore';
import {EventAggregator} from 'aurelia-event-aggregator';
import { EVENTS as AUTH_EVENTS } from '../stores/authStore';
import camelCase from 'lodash/camelCase';

export class App {
  static inject() {
    return [AuthStore, EventAggregator];
  }

  constructor(AuthStore, EventAggregator) {
    this.authStore = AuthStore;
    this.eventAggregator = EventAggregator;
    this.getAuthData = this.getAuthData.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    this.eventAggregator.publish(AUTH_EVENTS.LOGIN);
  }

  getAuthData() {
    return this.authStore.data;
  }

  configureRouter(config, router) {
    const routes = [
      { route: ['', 'dashboard'], name: 'dashboard', moduleId: PLATFORM.moduleName('pages/dashboard/dashboard'), settings: { auth: true } },
      { route: ['grid'], name: 'grid', moduleId: PLATFORM.moduleName('pages/home/index'), settings: { auth: true } },
      { route: ['auth'], name: 'auth', moduleId: PLATFORM.moduleName('pages/auth/index'), settings: { auth: false } },
      { route: ['help'], name: 'help', moduleId: PLATFORM.moduleName('pages/help/help'), nav: true, settings: { auth: true } },
      { route: ['data-methodology'], name: 'data-methodology', moduleId: PLATFORM.moduleName('pages/data-methodology/data-methodology'), nav: true, settings: { auth: true } },
      { route: ['other-data-tools'], name: 'other-data-tools', moduleId: PLATFORM.moduleName('pages/other-data-tools/other-data-tools'), nav: true, settings: { auth: true } },

      // External routes
      { route: ['password-change'], name: 'password-change', redirect: 'https://www.ovumkc.com/profile/password'}
    ];

    config.title = 'Omdia Forecaster';
    config.addAuthorizeStep(new Authorizer(this.getAuthData, this.login));
    config.map(routes);

    router.urlFor = routes.reduce((acc, route) =>
      ({...acc, [camelCase(route.name)]: (props, absolute = true) =>
        (absolute ? window.location.origin : '') + '/' + router.generate(route.name, props)
      }), {});

    router.navigateTo = routes.reduce((acc, route) =>
      ({...acc, [camelCase(route.name)]: props => router.navigateToRoute(route.name, props)}), {});

    this.router = router;
  }
}
