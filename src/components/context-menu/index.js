import {bindable, bindingMode} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DataStore, EVENTS as DATASTORE_EVENTS } from '../../stores/dataStore';
import { QueryStore } from '../../stores/queryStore';
import * as GLOBAL_EVENTS from './../../events';
import { updateListState } from '../panels/multi-list-panel/helpers';
require('./index.scss');

export const EVENTS = {
  CONTEXT_MENU_OPEN: 'contenxt_menu_open',
  PARENT_REQUESTED: 'DataSetPanel_ParentRequested',
  CHILDREN_REQUESTED: 'DataSetPanel_ChildrenRequested',
  PARENT_SELECTED: 'DataSetPanel_ParentSelected',
  PARENT_UNSELECTED: 'DataSetPanel_ParentUnSelected',
  CHILD_SELECTED: 'DataSetPanel_ChildSelected',
  CHILD_UNSELECTED: 'DataSetPanel_ChildUnSelected',
  UNSELECT_ALL: 'DataSetPanel_unselect_all',
  SELECT_ALL: 'DataSetPanel_select_all'
};

export const STATES = {
  UNCHECKED: 0,
  CHECKED: 1,
  INDETERMINATE: 2
};

export class ContextMenu {

  @bindable({ defaultBindingMode: bindingMode.oneTime }) onSort;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onRemove;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onPin;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onUnpin;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onMoveLeft;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onMoveRight;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnType;
  @bindable isAggregable;
  @bindable isSortable;
  @bindable isPinnable;
  @bindable isMoveableLeft;
  @bindable isMoveableRight;
  @bindable columnRef;
  @bindable selectedColumnFilters;

  static inject() {
    return [
      EventAggregator,
      DataStore,
      QueryStore
    ];
  }

  constructor(EventAggregator, DataStore, QueryStore) {
    this.DataStore = DataStore;
    this.queryStore = QueryStore;
    this.selectedColumnFilters = this.queryStore.data.columnFilters;
    this.eventAggregator = EventAggregator;
    this.open = false;
    this.toggleState = this.toggleState.bind(this);
    // this.eventAggregator.publish(GLOBAL_EVENTS.FETCH_TAXONOMY_DATA, 'dataset');
    this.eventAggregator.subscribe(EVENTS.CONTEXT_MENU_OPEN, this.onContextOpen.bind(this));
    this.eventAggregator.subscribe(GLOBAL_EVENTS.DATA_GRID_SCROLL, () => { this.close(); });

    this.toggleItem = (item) => {
      let event = item.state === STATES.CHECKED ? GLOBAL_EVENTS.COLUMN_FILTERS_ADDED :GLOBAL_EVENTS.COLUMN_FILTERS_REMOVED;
      this.eventAggregator.publish(event, item);
    };
  }

  isParent(item) {
    return item.children && item.children.length > 0;
  }

  attached() {
    this.pinAction = this.columnType === 'pinned' ? 'Unpin' : 'Pin';
  }

  onContextOpen(thisRef) {
    if(thisRef !== this) {
      this.close();
    }
  }

  toggleState(event) {
    this.menu.style.left = event.clientX + 'px';
    this.open = !this.open;
    setImmediate(() => {
      if (this.menu) {
        const maxLeft = document.body.clientWidth - this.menu.clientWidth;
        if (this.menu.offsetLeft > maxLeft) {
          this.menu.style.left = maxLeft + 'px';
        }
      }
    });
    // Did we open the context menu? Load the filter
    if (this.open) {
      this.eventAggregator.subscribe(DATASTORE_EVENTS.FETCH_FILTER_DISTINCT_DONE, this.onFetchDimensionDistinct.bind(this));
      this.eventAggregator.publish(DATASTORE_EVENTS.FETCH_FILTER_DISTINCT, this.columnRef);
    }

    this.registerBodyListener();
    this.registerPopupListener();
  }

  registerPopupListener() {
    if (this.open === true) {
      setImmediate(() => {
        document.querySelector('.open .dropdown').addEventListener('mouseover', this.onPopupHover);
      });
    }
  }

  onPopupHover() {
    // Find the location of the popup
    // If we don't have enough space on the right, add a class to .dropdown
    // to make it render on the left
    const openMenu = document.querySelector('.open.menu');
    const menuBoundingRect = openMenu.getBoundingClientRect();
    const rightMost = menuBoundingRect.right;
    const windowWidth = window.outerWidth;
    if ((rightMost + 192) >= windowWidth) {
      // We're over. Add a class to render on the left
      document.querySelector('.open .dropdown .dropdownlist').classList.add('left');
    }
  }

  onFetchDimensionDistinct(result) {
    if (result.dimension === this.columnRef) {
      // Flatten the results into an array
      this.list = result.data.map((item) => {
        // Figure out the level
        let id;
        const hasLevel = this.columnRef.indexOf('level') > -1;
        if (hasLevel) {
          const levelParts = this.columnRef.split('level');
          id = `${item[this.columnRef]}-${levelParts[levelParts.length - 1]}`;
        }
        else {
          id = `${item[this.columnRef]}-0`;
        }

        return {
          name: item[this.columnRef],
          id: id
        };
      });
    }
  }

  onBodyClick = (event) => {
    let path = event.path || (event.composedPath && event.composedPath());
    if(!path) {
      let current = event.target;
      path = [{className: current.className}];
      while(current.parentNode) {
        path.push({className: current.parentNode.className});
        current = current.parentNode;
      }
    }
    const elInsideContextMenu = path.filter(element => {
      return element.className === 'context-menu';
    });
    if(elInsideContextMenu.length === 0) {
      this.close();
    }
  }

  registerBodyListener() {
    if (this.open === true) {
      setImmediate(() => {
        document.body.addEventListener('click', this.onBodyClick);
      });
      this.eventAggregator.publish(EVENTS.CONTEXT_MENU_OPEN, this);
    }
  }

  sort(ascending) {
    if (this.isSortable) {
      this.onSort(ascending);
      this.close();
    }
  }

  togglePin() {
    if(this.isPinnable) {
      const action = this.columnType === 'pinned' ? this.onUnpin : this.onPin;
      action();
      this.close();
    }
  }

  moveLeft() {
    if (this.isMoveableLeft) {
      this.onMoveLeft();
      this.close();
    }
  }

  moveRight() {
    if (this.isMoveableRight) {
      this.onMoveRight();
      this.close();
    }
  }

  remove() {
    if(this.isAggregable) {
      this.onRemove();
      this.close();
    }
  }

  close() {
    const dropdownEl = document.querySelector('.open .dropdown');
    if (dropdownEl) {
      dropdownEl.removeEventListener('mouseover', this.onPopupHover);
    }
    document.body.removeEventListener('click', this.onBodyClick);
    this.open = false;
  }
}
