import Store from './store';
import * as GLOBAL_EVENTS from './../events';


export class UIStore extends Store {

  constructor(...rest) {
    super(...rest);
  }
  name() {
    return 'uistore';
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.TOGGLE_TAXONOMY_SUB_MENU,
      GLOBAL_EVENTS.TOGGLE_TAXONOMY_ICON_VIEW
    ];
  }

  getDefaultState() {
    return {
      openTaxonomySubMenu: false,
      viewMode: null
    };
  }
	
  toggleSubMenu(data) {
    this.data = {
      ...this.data,
      openTaxonomySubMenu: data ? data : !this.data.openTaxonomySubMenu
    };
  }

  toggleTaxonomyViewMode(data) {
    this.data = {
      ...this.data,
      viewMode: data
    };
  }

  onEvent(data, event) {
    switch (event) {
    case GLOBAL_EVENTS.TOGGLE_TAXONOMY_SUB_MENU:
      this.toggleSubMenu(data);
      break;
    case GLOBAL_EVENTS.TOGGLE_TAXONOMY_ICON_VIEW:
      this.toggleTaxonomyViewMode(data);
      break;
    }
  }
}
