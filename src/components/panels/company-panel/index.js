import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, BindingEngine } from 'aurelia-framework';
import filter from 'lodash/filter';
import { CompanyStore } from '../../../stores/companyStore';
import { StoreComponent } from './../../store-component';
import { EVENTS as SearchPanelEvents } from '../search-panel';
import * as GLOBAL_EVENTS from '../../../events';

export const STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  INDETERMINATE: 2
};

export class CompanyPanel extends StoreComponent {

  @bindable hasResults;
  @bindable calculateLiveCount;

  static inject() {
    return [CompanyStore, EventAggregator, BindingEngine];
  }

  constructor(CompanyStore, EventAggregator, BindingEngine) {
    super(CompanyStore, EventAggregator);

    this.selectAll = false;
    this.STATES = STATES;
    this.dimensionItem = {};
    this.calculateLiveCount = true;
  }

  attached() {
    super.attached();
    this.subscribe(SearchPanelEvents.ON_SELECTION, this.onSelect.bind(this));
    this.subscribe(SearchPanelEvents.ON_UNSELECTION, this.onUnSelect.bind(this));
    this.subscribe(SearchPanelEvents.ON_RESULTS, this.onResults.bind(this));
    const list = this.searchResults.length > 0 ? this.searchResults : (this.selection && this.selection.length > 0 ? this.selection : this.list);
    this.hasResults = list && list.length > 0;
  }

  get selection() {
    return this.data && this.data.dimension && filter(this.data.dimension.items, (item) => {
      return item.state === 1;
    });
  }

  selectAllChange(toggleValue) {
    this.selectAll = toggleValue;
    this.dimensionItem.state = this.selectAll ? STATES.UNCHECKED : STATES.CHECKED;
    const list = this.searchResults.length > 0 ? this.searchResults : (this.selection.length > 0 ? this.selection : this.list);

    list.forEach(item => {
      item.ignoreParent = true;
      this.publish(SearchPanelEvents.ITEM_STATE_CHANGED, item);
    });
    this.hasResults = list.length > 0;
  }

  setItemState(item) {
    switch (item.state) {
    case STATES.CHECKED:
      if(!this.canUncheck || this.canUncheck(this.list)) {
        item.state = STATES.UNCHECKED;
      }
      break;
    case STATES.UNCHECKED:
      item.state = STATES.CHECKED;
      break;
    case STATES.INDETERMINATE:
      item.state = STATES.CHECKED;
      break;
    }

    return item;
  }

  unselectAll() {
    this.selectAllChange(false);
  }

  onResults(hasResults) {
    this.hasResults = hasResults;
  }

  onSelect(item) {
    this.publish(GLOBAL_EVENTS.FILTERS_ADDED, [{
      type: 'company',
      name: item.name
    }]);
  }

  onUnSelect(item) {
    this.publish(GLOBAL_EVENTS.FILTERS_REMOVED, [{
      type: 'company',
      name: item.name
    }]);
  }

  refresh() {
    this.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'company');
  }
}
