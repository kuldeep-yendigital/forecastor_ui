import { STATES } from './panels/multi-list-panel/index';
import { StoreComponent } from './store-component';
import * as GLOBAL_EVENTS from '../events';

export class DimensionPanel extends StoreComponent {

  constructor(TypeStore, EventAggregator, panelType, Events) {
    super(TypeStore, EventAggregator);

    this.panelType = panelType;
    this.events = Events;
  }

  isComplex(item) {
    return item.aggregationType && item.aggregationType.toLowerCase().trim() !== 'simple';
  }

  getParent(item) {
    this.publish(this.events.PARENT_REQUESTED, item);
  }

  getChildren(item) {
    this.publish(this.events.CHILDREN_REQUESTED, item);
  }

  onItemSelectChange(item) {
    let event;

    if (this.isParent(item)) {
      event = item.state === STATES.CHECKED ? this.events.PARENT_SELECTED : this.events.PARENT_UNSELECTED;
      this.publish(event, item);
    } else {
      event = item.state === STATES.CHECKED ? this.events.CHILD_SELECTED : this.events.CHILD_UNSELECTED;
      this.publish(event, item);
    }
  }

  isParent(item) {
    return item.children && item.children.length > 0;
  }

  refresh() {
    this.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, this.panelType);
  }
}
