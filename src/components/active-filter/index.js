import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ActiveFilterStore} from '../../stores/activeFilterStore';
import {EVENTS} from '../../stores/activeFilterStore';
import includes from 'lodash/includes';

require('./index.scss');

export const dimensionsToSelectionHierarchy = dimensions => {
  const inner = item => ({
    name: item.name,
    checked: true,
    indeterminate: false,
    children: item.children.map(inner)
  });
  return dimensions.map(inner);
};

export const applySelection = (items, path, checked) => {
  const inner = (acc, item, index) => {
    if (!acc.path.length || +acc.path[0] === index) {
      const children = item.children.reduce(inner, {
        ...acc,
        result: [],
        path: acc.path.slice(1)
      }).result;
      const indeterminate = !!item.children.length && (children.some(child => child.indeterminate) || (
        children.some(child => child.checked) && children.some(child => !child.checked)
      ));
      const checked = !acc.path.length ?
        acc.checked :
        (!item.children.length ?
          acc.checked :
          !indeterminate && !children.every(child => !child.checked));
      return {
        ...acc,
        result: acc.result.concat([ {
          ...item,
          checked,
          indeterminate,
          children
        } ])
      };
    } else {
      return {
        ...acc,
        result: acc.result.concat([ item ])
      };
    }
  };
  return items.reduce(inner, {
    path,
    checked,
    result: []
  }).result;
};

export const applyVisibility = (predicate, items) => {
  const inner = item => {
    const children = item.children.map(inner);
    return {
      ...item,
      visible: predicate(item) || children.some(child => child.visible),
      children: children
    };
  };
  return items.map(inner);
};

export const caseInsensitiveNameMatch = search => {
  const normalized = search.toLowerCase();
  return item => includes(item.name.toLowerCase(), normalized);
};

export const filtersRemoved = (dimensions, items) => {
  const inner = (acc, item) => {
    if (!item.children.length && !item.checked) {
      return acc.concat([ item.name ]);
    } else {
      return acc.concat(item.children.reduce(inner, []));
    }
  };
  return dimensions.map((dimension, index) => ({
    type: dimension.key,
    names: items[index].children.reduce(inner, [])
  })).filter(filter => filter.names.length);
};

export class ActiveFilter {
  @bindable dimensions;
  @bindable selection;
  @bindable search;

  static inject() {
    return [ActiveFilterStore, EventAggregator];
  }

  constructor(activeFilterStore, eventAggregator) {
    this.ea = eventAggregator;
    this.dimensions = [];
    this.selection = [];
    this.activeFilterStore = activeFilterStore;
    this.onToggle = this.toggleSelection.bind(this);
    this.activeFilterStore.subscribe(this.activeFiltersChanged.bind(this));
    this.search = '';
    this.ea.subscribe(EVENTS.APPLY_FILTER_CHANGES, this.applyChanges.bind(this));
    this.ea.subscribe(EVENTS.CANCEL_FILTER_CHANGES, this.resetChanges.bind(this));
  }

  activeFiltersChanged() {
    this.dimensions = this.activeFilterStore.data.hierarchy;
    this.selection = applyVisibility(caseInsensitiveNameMatch(this.search), dimensionsToSelectionHierarchy(this.dimensions));
  }

  toggleSelection(id, checked) {
    this.selection = applySelection(this.selection, id.split('.'), checked);
  }

  searchChanged() {
    this.selection = applyVisibility(caseInsensitiveNameMatch(this.search), this.selection);
  }

  applyChanges() {
    this.activeFilterStore.removeFilters(filtersRemoved(this.dimensions, this.selection));
    this.search = '';
  }

  resetChanges() {
    this.selection = applyVisibility(() => true, dimensionsToSelectionHierarchy(this.dimensions));
    this.search = '';
  }

}
