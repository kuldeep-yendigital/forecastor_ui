import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'CustomerTypePanel_ParentRequested',
  CHILDREN_REQUESTED: 'CustomerTypePanel_ChildrenRequested',
  PARENT_SELECTED: 'CustomerTypePanel_ParentSelected',
  PARENT_UNSELECTED: 'CustomerTypePanel_ParentUnSelected',
  CHILD_SELECTED: 'CustomerTypePanel_ChildSelected',
  CHILD_UNSELECTED: 'CustomerTypePanel_ChildUnSelected',
  UNSELECT_ALL: 'CustomerTypePanel_unselect_all',
  SELECT_ALL: 'CustomerTypePanel_select_all'
};

export class CustomerTypeStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Customer Type', 'customertype', EVENTS, ...rest);
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
