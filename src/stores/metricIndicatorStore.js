import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'MetricIndicatorPanel_ParentRequested',
  CHILDREN_REQUESTED: 'MetricIndicatorPanel_ChildrenRequested',
  PARENT_SELECTED: 'MetricIndicatorPanel_ParentSelected',
  PARENT_UNSELECTED: 'MetricIndicatorPanel_ParentUnSelected',
  CHILD_SELECTED: 'MetricIndicatorPanel_ChildSelected',
  CHILD_UNSELECTED: 'MetricIndicatorPanel_ChildUnSelected',
  UNSELECT_ALL: 'MetricIndicatorPanel_unselect_all',
  SELECT_ALL: 'MetricIndicatorPanel_select_all'
};

export class MetricIndicatorStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Metric Indicator', 'metricindicator', EVENTS, ...rest);
  }

  get EVENTS() {
    return [
      GLOBAL_EVENTS.FETCH_TAXONOMY_DATA,
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
