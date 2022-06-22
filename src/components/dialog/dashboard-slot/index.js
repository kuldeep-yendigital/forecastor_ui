import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogController} from 'aurelia-dialog';

import {DashboardStore, EVENTS as DASHBOARD_EVENTS} from '../../../stores/dashboardStore';
import * as GLOBAL_EVENTS from '../../../events';

require('./index.scss');

export class DashboardSlot {
  @bindable selectedSlot;

  static inject() {
    return [DashboardStore, EventAggregator, DialogController];
  }

  constructor(dashboardStore, eventAggregator, dialogController) {
    this.dashboardStore = dashboardStore;
    this.eventAggregator = eventAggregator;
    this.dialogController = dialogController;
    this.title = '';
    this.description = '';
    this.selectedSlot = -1;
    this.selectedRadio = -1;
  }

  attached() {
    this.subscriptions = [
      this.dashboardStore.subscribe(() => this.refreshState())
    ];
    this.refreshState();
    this.eventAggregator.publish(DASHBOARD_EVENTS.FETCH_DASHBOARD);
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  save() {
    let event;
    let data = {
      title: this.title,
      description: this.description
    };
    if (!this.title) {
      this.eventAggregator.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'Please enter a title');
    } else {
      if (this.selectedSlot === -1) {
        event = DASHBOARD_EVENTS.SAVE_SLOT;
      } else {
        event = DASHBOARD_EVENTS.REPLACE_SLOT;
        data = {
          ...data,
          index: this.selectedSlot
        };
      }
      this.eventAggregator.publish(event, data);
      this.eventAggregator.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'The graph has been saved to your dashboard');
      this.dialogController.ok();
    }
  }

  replace() {
    this.selectedSlot = this.selectedRadio;
  }

  refreshState() {
    this.loaded = this.dashboardStore.data.loaded;
    this.full = this.dashboardStore.data.full;
    this.slots = this.dashboardStore.data.slots;
  }

}
