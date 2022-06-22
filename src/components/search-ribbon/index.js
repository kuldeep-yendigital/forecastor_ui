import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from '../../events';
import {QueryStore} from '../../stores/queryStore';
import {UIStore} from '../../stores/uiStore';

require('./index.scss');

export const VIEWMODES = {
  TEXT: 'view_text',
  ICON: 'view_icon'
};

function setPersistedViewMode(viewMode) {
  if(localStorage) {
    localStorage.setItem('forecaster-searchribbon-viewmode', viewMode);
  }
}

export class SearchRibbon {

  @bindable panelData;
  @bindable disabled;
  @bindable dimensions;
  @bindable selectedDimensions;

  static inject() {
    return [QueryStore, UIStore, EventAggregator];
  }

  constructor(QueryStore, UIStore, eventAggregator) {
    this.ea = eventAggregator;
    this.queryStore = QueryStore;
    this.uiStore = UIStore;
    this.onQueryUpdated();
    this.viewMode = this.getPersistedViewMode();
    this.openSubMenu = UIStore.data.openTaxonomySubMenu;
  }

  getPersistedViewMode = () => {
    const viewMode = localStorage ? localStorage.getItem('forecaster-searchribbon-viewmode') : null;
    if (viewMode) {
      this.ea.publish(GLOBAL_EVENTS.TOGGLE_TAXONOMY_ICON_VIEW, viewMode);
    }
    return viewMode;
  }

  onUIUpdated() {
    this.openSubMenu = this.uiStore.data.openTaxonomySubMenu;
    this.viewMode = this.uiStore.data.viewMode;
  }

  attached() {
    this.subscriptions = [
      this.ea.subscribe(GLOBAL_EVENTS.RESTORED_DEFAULTS, this.onDefaultsRestored.bind(this)),
      this.queryStore.subscribe(this.onQueryUpdated.bind(this)),
      this.uiStore.subscribe(this.onUIUpdated.bind(this))
    ];
  }

  onDefaultsRestored() {
    this.ea.publish(GLOBAL_EVENTS.TOGGLE_TAXONOMY_SUB_MENU, false);
    this.panelData = null;
  }

  onQueryUpdated() {
    this.selectedDimensions = [];
    if(this.queryStore.data && this.queryStore.data.filters){
      this.selectedDimensions = this.selectedDimensions.concat(Object.keys(this.queryStore.data.filters));
    }
    if(this.queryStore.data && this.queryStore.data.compositeFilters){
      this.selectedDimensions = this.selectedDimensions.concat(Object.keys(this.queryStore.data.compositeFilters));
    }
  }

  isDimensionOpen(item) {
    return this.panelData && (this.panelData.dimension === item.name);
  }

  onToggleSubMenu(item) {
    if (this.openSubMenu) {
      if (this.isDimensionOpen(item)) {
        this.ea.publish(GLOBAL_EVENTS.TOGGLE_TAXONOMY_SUB_MENU, false);
        this.panelData = null;
        this.onSelect(item);
      }
      else {
        this.onSelect(item);
      }
    }
    else {
      this.ea.publish(GLOBAL_EVENTS.TOGGLE_TAXONOMY_SUB_MENU, true);
      this.onSelect(item);
    }
  }

  toggleView = () => {
    const viewMode = this.viewMode === VIEWMODES.ICON ? VIEWMODES.TEXT : VIEWMODES.ICON;
    this.ea.publish(GLOBAL_EVENTS.TOGGLE_TAXONOMY_ICON_VIEW, viewMode);
    setPersistedViewMode(viewMode);
  }

  onSelect(item) {
    this.ea.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, item.name.toLowerCase());
    this.panelData = {
      dimension: item.name
    };
  }

  detached() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
