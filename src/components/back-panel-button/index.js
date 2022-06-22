import { EventAggregator } from 'aurelia-event-aggregator';

require('./index.scss');

export const EVENTS = {
  BACK_PANEL: 'BackPanelButton_backPanel'
};

export class BackPanelButton {
  static inject() {
    return [EventAggregator];
  }
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }
  handleBack() {
    this.eventAggregator.publish(EVENTS.BACK_PANEL);
  }
}
