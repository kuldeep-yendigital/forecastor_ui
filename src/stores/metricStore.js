import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'MetricPanel_ParentRequested',
  CHILDREN_REQUESTED: 'MetricPanel_ChildrenRequested',
  PARENT_SELECTED: 'MetricPanel_ParentSelected',
  PARENT_UNSELECTED: 'MetricPanel_ParentUnSelected',
  CHILD_SELECTED: 'MetricPanel_ChildSelected',
  CHILD_UNSELECTED: 'MetricPanel_ChildUnSelected',
  UNSELECT_ALL: 'MetricPanel_unselect_all',
  SELECT_ALL: 'MetricPanel_select_all'
};

export class MetricStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Metric', 'metric', EVENTS, ...rest);
  }

  fetch() {
    return this.service.fetchFrom('dataApiBase', `metrics`);
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.FETCH_TAXONOMY_DATA,
      GLOBAL_EVENTS.RESTORE_DEFAULT_SEARCH,
      GLOBAL_EVENTS.DIMENSION_COUNT_DONE,
      EVENTS.PARENT_REQUESTED,
      EVENTS.CHILDREN_REQUESTED,
      EVENTS.PARENT_SELECTED,
      EVENTS.PARENT_UNSELECTED,
      EVENTS.CHILD_SELECTED,
      EVENTS.CHILD_UNSELECTED,
      EVENTS.UNSELECT_ALL,
      EVENTS.SELECT_ALL
    ];
  }
}
