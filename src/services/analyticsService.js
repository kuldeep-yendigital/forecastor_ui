import {LoggerService} from './loggerService';

const DEFAULT_TIMEOUT = 1000;

window.analyticsEvents = window.analyticsEvents || {
  'exception': true
};

export class AnalyticsService {

  static inject() {
    return [DEFAULT_TIMEOUT, LoggerService];
  }

  constructor(timeout, loggerService) {
    this.timeout = timeout;
    this.dataLayer = window.dataLayer || [];
    this.logger = loggerService.createLogger('AnalyticsService');
  }

  pushEvent(event, data, callback) {
    if (!window.analyticsEvents[event]) {
      throw new Error('Event not registered! ' + event);
    }

    if (typeof data === 'function') {
      callback = data;
      data = {};
    }

    let callbackTriggered = false;

    let eventCallback = callback ? () => {
      if (!callbackTriggered) {
        callback();
        callbackTriggered = true;
      }
    } : callback;

    // this.logger.info('event pushed', event, data);

    this.dataLayer.push(Object.assign({
      event,
      eventCallback
    }, data));

    // GTM executes eventCallback normally after sending event,
    // timeout here is a fallback incase GTM is not loaded.
    if (callback) {
      setTimeout(eventCallback, this.timeout);
    }

    // Approximates GTM resolving dataLayer variables. Uncomment for debugging
    // this.logger.info('data layer', this.dataLayer.reduce((acc, data) => {
    //   return merge({}, acc, data);
    // }, {}));
  }

  pushException(description, fatal, callback) {
    if (typeof fatal === 'function') {
      callback = fatal;
      fatal = false;
    }

    this.pushEvent('exception', {
      exDescription: description,
      exFatal: fatal || false
    }, callback);
  }
}

AnalyticsService.register = function (events) {
  Object.keys(events).forEach(key => {
    window.analyticsEvents[events[key]] = true;
  });
  return events;
};
