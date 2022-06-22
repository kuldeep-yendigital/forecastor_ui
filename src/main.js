import 'isomorphic-fetch';
import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';
import { PLATFORM } from 'aurelia-pal';
import { LogManager } from 'aurelia-framework';
import { getConf } from '../config/client.config.provider';
import { HttpClient } from 'aurelia-fetch-client';
import rp from 'request-promise';
import { startTour } from './tour/helpers';
import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ConsoleFormattedStream } from '@browser-bunyan/console-formatted-stream';

require('materialize-css/dist/css/materialize.min.css');
require('hopscotch/dist/css/hopscotch.min.css');
require('./styles/styles.scss');

// the below image is required here as it needs to be
// bundled with the frontend build and served on the
// Auth0 login sreen
require('../resources/Web_Ovum_Whiteout_4d_logo.png');

class ErrorBubbler {
  constructor() {
    this.logger = createLogger({
      name: 'ui-logger',
      streams: [
        {
          level: ERROR,
          stream: new ConsoleFormattedStream()
        }
      ],
      serializers: stdSerializers,
      src: true
    });
  }

  error(logger, error) {
    this.logger.error(error);
    throw error;
  }
}

function initializeAnalytics(id, auth, env) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    'event': 'gtm.js'
  });
  const firstScript = document.getElementsByTagName('script')[0];
  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtm.js?id=${id}&gtm_auth=${auth}&gtm_preview=${env}&gtm_cookies_win=x`;
  firstScript.parentNode.insertBefore(analyticsScript, firstScript);
}

function initializeAdobeVisitorAPI() {
  const firstScript = document.getElementsByTagName('script')[0];
  const visitorApiScript = document.createElement('script');
  visitorApiScript.async = true;
  visitorApiScript.onload = () => initializeAdobeAppMeasurement(firstScript);
  visitorApiScript.src = 'assets/lib/VisitorAPI.js';
  firstScript.parentNode.insertBefore(visitorApiScript, firstScript);
}

function initializeAdobeAppMeasurement(firstScript) {
  const appMeasurementScript = document.createElement('script');
  appMeasurementScript.async = true;
  appMeasurementScript.src = 'assets/lib/AppMeasurement.js';
  firstScript.parentNode.insertBefore(appMeasurementScript, firstScript);
}

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'));

  const config = getConf();
  const gtmId = config.get('gtmId');
  const gtmAuth = config.get('gtmAuth');
  const gtmEnv = config.get('gtmEnv');

  if (window.config.envName === 'qa') {
    initializeAdobeVisitorAPI();
  }

  if (gtmId) {
    initializeAnalytics(gtmId, gtmAuth, gtmEnv);
  }

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  }

  const webAuth = new auth0.WebAuth({
    domain: config.get('authDomain'),
    clientID: config.get('authClientId'),
    redirectUri: `${window.location.origin}/callback.html`,
    audience: config.get('authAudience'),
    responseType: 'token id_token',
    scope: 'openid profile user_metadata'
  });

  const httpClient = new HttpClient();
  httpClient.configure(config => {
    config.withDefaults({
      mode: 'cors'
    }).withInterceptor({
      request(request) {
        request.headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        request.headers.set('Content-type', 'application/json');
        return request;
      },
      response(response) {
        if (response.status === 401) {
          webAuth.authorize();
          return;
        }
        return response;
      }
    });
  });

  let requestWrapper = {};

  requestWrapper.fetch = (url, options) => {
    let headers = Object.assign({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-type': 'application/json'
    }, options.headers || {});

    delete options.headers;

    let defaultOptions = {
      mode: 'disable-fetch'
    };

    const reqOptions = Object.assign({}, {
      uri: url,
      headers,
      withCredentials: true
    }, defaultOptions, options);

    return rp(reqOptions)
      .promise()
      .timeout(config.get('REQUEST_TIMEOUT'))
      .catch((error) => {
        if (error.statusCode === 401) {
          return webAuth.authorize();
        } else if (error.statusCode === 500) {
          console.error(error);
        } else {
          console.warn('Request error ', error);
        }
        throw error;
      });
  };

  aurelia.container.registerInstance(HttpClient, httpClient);
  aurelia.container.registerInstance('request', requestWrapper);
  aurelia.container.registerSingleton('config', getConf);
  aurelia.container.registerInstance('webAuth', webAuth);
  aurelia.container.registerInstance('jwtDecode', jwtDecode);
  aurelia.container.registerInstance('currentTime', () => new Date().getTime());

  // Stop aurelia swallowing errors!
  LogManager.addAppender(new ErrorBubbler());
  LogManager.setLevel(LogManager.logLevel.error);

  return aurelia.start().then(() => {
    aurelia.setRoot(PLATFORM.moduleName('app/index'));
  });
}
