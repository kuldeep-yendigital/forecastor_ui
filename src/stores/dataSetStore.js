import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'DataSetPanel_ParentRequested',
  CHILDREN_REQUESTED: 'DataSetPanel_ChildrenRequested',
  PARENT_SELECTED: 'DataSetPanel_ParentSelected',
  PARENT_UNSELECTED: 'DataSetPanel_ParentUnSelected',
  CHILD_SELECTED: 'DataSetPanel_ChildSelected',
  CHILD_UNSELECTED: 'DataSetPanel_ChildUnSelected',
  UNSELECT_ALL: 'DataSetPanel_unselect_all',
  SELECT_ALL: 'DataSetPanel_select_all'
};

export class DataSetStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Data Set', 'dataset', EVENTS, ...rest);
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
