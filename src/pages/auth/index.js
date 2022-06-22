import { Router } from 'aurelia-router';
import { AuthStore, EVENTS as AUTH_EVENTS } from '../../stores/authStore';
import {EventAggregator} from 'aurelia-event-aggregator';
import { LoggerService } from '../../services/loggerService';

require('./auth.scss');

export class Auth {
  static inject() {
    return [AuthStore, Router, EventAggregator, LoggerService];
  }

  constructor(AuthStore, router, EventAggregator, loggerService) {
    this.router = router;
    this.authStore = AuthStore;
    this.eventAggregator = EventAggregator;
    this.logger = loggerService.createLogger('Auth');
  }

  activate() {
    this.logger.info('activated');
    this.authStore.subscribe(this.onAuthChange.bind(this));
    this.eventAggregator.publish(AUTH_EVENTS.AUTHENTICATE_USER);
  }

  onAuthChange(data) {
    this.logger.info('navigating to dashboard');
    this.router.navigateTo.dashboard();
  }
}
