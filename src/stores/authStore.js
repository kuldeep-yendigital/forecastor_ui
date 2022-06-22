import Store from './store';
import { Router } from 'aurelia-router';
import Session from '../pages/auth/session';
import { AnalyticsService } from '../services/analyticsService';
import { LoggerService } from '../services/loggerService';

export const EVENTS = {
  LOCALSTORAGE_AUTH: 'authstore_localstorage_auth',
  AUTHENTICATE_USER: 'authstore_authenticate',
  LOGIN: 'authstore_login',
  LOGOUT: 'authstore_logout'
};

export const ANALYTICS = AnalyticsService.register({
  // User already authenticated on load
  ALREADY_LOGGED_IN: 'authstore_localstorage_auth',

  // Authenticated, i.e. redirected with auth token
  LOGGED_IN: 'authstore_authenticated',

  // Log in triggered
  LOGIN: 'authstore_login',

  // Log out triggered
  LOGOUT: 'authstore_logout'
});

export class AuthStore extends Store {

  static inject() {
    return ['currentTime', 'config', 'webAuth', 'jwtDecode', AnalyticsService, LoggerService, Router];
  }

  constructor(currentTime, config, webAuth, jwtDecode, analyticsService, loggerService, Router, ...rest) {
    super(...rest);
    this.config = config;
    this.webAuth = webAuth;
    this.session = new Session(currentTime, jwtDecode, Router);
    this.analyticsService = analyticsService;
    this.logger = loggerService.createLogger('AuthStore');

    this.data = {
      user: {
        ...this.session.getUser()
      },
      isValid: this.session.isValid()
    };

    if (this.data.user.id) {
      this.logger.info('already logged in');
      this.analyticsService.pushEvent(ANALYTICS.ALREADY_LOGGED_IN, this.data.user);
    }
  }

  getDefaultState() {
    return {
      user: null,
      isValid: false
    };
  }

  get EVENTS() {
    return [
      EVENTS.AUTHENTICATE_USER,
      EVENTS.LOGIN,
      EVENTS.LOGOUT
    ];
  }

  setSession(authResult) {
    this.session.start(authResult);
  }

  endSession() {
    this.session.end();
  }

  authenticate() {
    const queryParam = window.location.href.split('?')[1];

    this.webAuth.parseHash({
      hash: queryParam
    }, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.logger.info('session set');
        this.setSession(authResult);
        this.data = {
          user: {
            ...this.session.getUser()
          },
          isValid: this.session.isValid()
        };
        this.analyticsService.pushEvent(ANALYTICS.LOGGED_IN, this.data.user);
      } else if (err) {
        // error is not a real JavaScript error, it is an auth0 error response
        this.logger.error(err.error, err.errorDescription);
        this.analyticsService.pushException(err.error);
      }
    });
  }

  login() {
    this.storeGridHash();
    this.webAuth.authorize();
  }

  storeGridHash() {
    const gridQueryParam = 'grid?s=';
    if (location.href.indexOf(gridQueryParam) > -1 && location.href.split(gridQueryParam)[1]) {
      let bookmarkId = location.href.split(gridQueryParam)[1];
      if (bookmarkId.trim() !== '') {
        localStorage.setItem('bookmarkId', bookmarkId);
      }
    }
  }

  logout() {
    this.endSession();
    this.webAuth.logout({
      returnTo: this.data.user.salesforceBaseUrl + '/secur/logout.jsp'
    });
  }

  onEvent(data, event) {
    switch (event) {
    case EVENTS.AUTHENTICATE_USER:
      this.authenticate();
      break;
    case EVENTS.LOGIN:
      this.analyticsService.pushEvent(ANALYTICS.LOGIN, () => {
        this.login();
      });
      break;
    case EVENTS.LOGOUT:
      this.analyticsService.pushEvent(ANALYTICS.LOGOUT, () => {
        this.logout();
      });
      break;
    }
  }

  isExportEnabled() {
    return true;
  }
}
