import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'ServiceTypePanel_ParentRequested',
  CHILDREN_REQUESTED: 'ServiceTypePanel_ChildrenRequested',
  PARENT_SELECTED: 'ServiceTypePanel_ParentSelected',
  PARENT_UNSELECTED: 'ServiceTypePanel_ParentUnSelected',
  CHILD_SELECTED: 'ServiceTypePanel_ChildSelected',
  CHILD_UNSELECTED: 'ServiceTypePanel_ChildUnSelected',
  UNSELECT_ALL: 'ServiceTypePanel_unselect_all',
  SELECT_ALL: 'ServiceTypePanel_select_all'
};

export class ServicesStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Services', 'services', EVENTS, ...rest);
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
