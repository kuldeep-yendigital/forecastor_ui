import { DashboardStore, MAX_SLOTS } from '../../stores/dashboardStore';

require('./index.scss');

export class DashboardSlots {

  static inject() {
    return [DashboardStore];
  }

  constructor(dashboardStore, authStore) {
    this.dashboardStore = dashboardStore;
    this.exportable = false;
    this.updateSlots();
  }

  attached() {
    this.subscriptions = [
      this.dashboardStore.subscribe(this.updateSlots.bind(this))
    ];
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  updateSlots() {
    this.slots = this.dashboardStore.data.slots;
    this.emptySlots = MAX_SLOTS - this.slots.length;
  }

}
