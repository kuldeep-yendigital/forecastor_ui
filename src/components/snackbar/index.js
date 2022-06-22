import * as GLOBAL_EVENTS from './../../events';
import { EventAggregator } from 'aurelia-event-aggregator';

require('./index.scss');

/**
 * Default delay in milliseconds
 * @type {Number}
 */
const DEFAULT_DELAY = 5000;

export class Snackbar {
  static inject() {
    return [
      'config',
      EventAggregator
    ];
  }

  /**
   * @param  {Object} Config
   * @param  {EventAggregator} EventAggregator
   * @return {void}
   */
  constructor(Config, EventAggregator) {
    this.config      = Config;
    this.message     = '';
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);

    this.ea = EventAggregator;
    this.ea.subscribe(
      GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, this.showMessage
    );
  }

  /**
   * @return {void}
   */
  hideMessage() {
    this.message = '';
  }

  /**
   * @param  {String} message
   * @return {void}
   */
  showMessage(message) {
    this.message = message;

    setTimeout(
      this.hideMessage,
      this.config.get('systemMessage').delay || DEFAULT_DELAY
    );
  }
}
