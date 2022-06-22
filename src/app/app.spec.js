/* global describe, it, expect, PLATFORM, afterEach, beforeEach, jasmine, spyOn, window */
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Authorizer } from './authorizer';
import Store from '../stores/store';
import { AuthStore } from '../stores/authStore';
import {FakeEventAggregator} from '../../test/unit/helpers/fakes';

class ConfigSpy {
  constructor() {
    this.options = {};
  }

  map(routes) {
    this.routes = routes;
  }

  addAuthorizeStep(authorizer) {
    this.authorizer = authorizer;
  }
}

describe('App', () => {

  let mockData;
  let model;
  let component;
  let onDataUpdateSpy;

  class MockStore extends Store {
    get EVENTS() {
      return [];
    }

    getDefaultState() {
      return mockData;
    }
  }

  class MockAnalyticsStore {

  }

  describe('Routing', () => {
    mockData = {};
    let component, configSpy, router;

    beforeEach((done) => {
      router = {};
      configSpy = new ConfigSpy();
      component = StageComponent
        .withResources(PLATFORM.moduleName('app/index'))
        .inView('<app></app>');

      component.bootstrap(aurelia => {
        aurelia.use.standardConfiguration();
        aurelia.container.registerSingleton(AuthStore, MockStore);
        aurelia.container.registerSingleton(EventAggregator, FakeEventAggregator);
      });

      component.create(bootstrap)
        .then(() => {
          component.viewModel.configureRouter(configSpy, router);
          done();
        })
        .catch(done.fail);
    });

    afterEach(() => {
      component.dispose();
    });

    it('title', () => {
      expect(configSpy.title).toEqual('Omdia Forecaster');
    });

    it('routes', () => {
      expect(configSpy.routes.length).toEqual(7);
    });

    it('root and home route', () => {
      expect(configSpy.routes).toContain({ route: ['grid'], name: 'grid', moduleId: 'pages/home/index', settings: { auth: true } });
    });

    it('dashboard route', () => {
      expect(configSpy.routes).toContain({ route: ['', 'dashboard'], name: 'dashboard', moduleId: 'pages/dashboard/dashboard', settings: { auth: true } });
    });

    it('auth route', () => {
      expect(configSpy.routes).toContain({ route: ['auth'], name: 'auth', moduleId: 'pages/auth/index', settings: { auth: false } });
    });

    it('help route', () => {
      expect(configSpy.routes).toContain({ route: ['help'], name: 'help', moduleId: PLATFORM.moduleName('pages/help/help'), nav: true, settings: { auth: true } });
    });

    it('data methodology route', () => {
      expect(configSpy.routes).toContain({ route: ['data-methodology'], name: 'data-methodology', moduleId: PLATFORM.moduleName('pages/data-methodology/data-methodology'), nav: true, settings: { auth: true } });
    });

    it('other data tools route', () => {
      expect(configSpy.routes).toContain({ route: ['other-data-tools'], name: 'other-data-tools', moduleId: PLATFORM.moduleName('pages/other-data-tools/other-data-tools'), nav: true, settings: { auth: true } });
    });

    it('assigns router', () => {
      expect(component.viewModel.router).toEqual(router);
    });

    describe('Authorization', () => {
      it('provides authorizer', () => {
        expect(configSpy.authorizer instanceof Authorizer).toEqual(true);
      });
    });
  });


});
