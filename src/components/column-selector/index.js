import {bindable} from 'aurelia-framework';
import { ColumnStore } from '../../stores/columnStore';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as GLOBAL_EVENTS from '../../events';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';

require('./index.scss');

function event(item) {
  return item.checked ? GLOBAL_EVENTS.COLUMNS_REMOVED : GLOBAL_EVENTS.COLUMNS_ADDED;
}

export class ColumnSelector {
  static inject() {
    return [ColumnStore, EventAggregator];
  }

  constructor(columnStore, eventAggregator) {
    this.columnStore = columnStore;
    this.eventAggregator = eventAggregator;
    this.open = false;
    this.toggleOpenClose = this.toggleOpenClose.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.toggleAllSelected = this.toggleAllSelected.bind(this);
    this.expanded = [];
    this.all = { checked: false, indeterminate: false };

    this.columnStore.subscribe(this.setColumns.bind(this));
    this.setColumns();
  }

  setColumns() {
    const colData = cloneDeep(this.columnStore.data.columns);

    const data = [];
    this.columnStore.getGroups().forEach((group) => {
      group.columns = colData.filter(c => c.parent === group.key);
      group.checked = group.columns.every(c => c.checked);
      group.indeterminate = !group.checked && group.columns.some(c => c.checked);
      group.expanded = this.expanded[group.key] || false;

      data.push(group);
    });

    this.all.checked = this.columnStore.data.columns.every(c => c.checked);
    this.all.indeterminate = !this.all.checked && this.columnStore.data.columns.some(c => c.checked);

    this.data = data;
  }

  toggleSelection(column) {
    if (column.readOnly) {
      return;
    }
    this.eventAggregator.publish(event(column), [column.key]);
  }

  toggleGroupSelected(group) {
    this.eventAggregator.publish(event(group), map(group.columns, 'key'));
  }

  toggleAllSelected(check) {
    this.eventAggregator.publish(event(check), map(this.columnStore.data.columns, 'key'));
  }

  toggleExpand(group) {
    group.expanded = !group.expanded;
    this.expanded[group.key] = !this.expanded[group.key];
  }

  toggleOpenClose() {
    this.menu.style.left = `${this.root.getBoundingClientRect().left}px`;
    this.open = !this.open;
    this.registerBodyListener();
  }

  isReadOnly(group) {
    return group.columns.every(c => c.readOnly);
  }

  registerBodyListener() {
    if (this.open === true) {
      const callback = (e) => {
        let path = e.path || (e.composedPath && e.composedPath());
        if (!path) {
          let current = e.target;
          path = [{ className: current.className }];
          while (current.parentNode) {
            path.push({ className: current.parentNode.className });
            current = current.parentNode;
          }
        }
        const elInsideContextMenu = path.filter((element) => {
          return element.className ? element.className.indexOf('column-selector') > -1 : false;
        });
        if (elInsideContextMenu.length === 0) {
          this.close();
          document.body.removeEventListener('click', callback);
        }
      };
      setImmediate(() => {
        document.body.addEventListener('click', callback);
      });
    }
  }

  close() {
    this.open = false;
  }
}
