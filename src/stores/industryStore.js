import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'IndustryPanel_ParentRequested',
  CHILDREN_REQUESTED: 'IndustryPanel_ChildrenRequested',
  PARENT_SELECTED: 'IndustryPanel_ParentSelected',
  PARENT_UNSELECTED: 'IndustryPanel_ParentUnSelected',
  CHILD_SELECTED: 'IndustryPanel_ChildSelected',
  CHILD_UNSELECTED: 'IndustryPanel_ChildUnSelected',
  UNSELECT_ALL: 'IndustryPanel_unselect_all',
  SELECT_ALL: 'IndustryPanel_select_all'
};

export class IndustryStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Industry', 'industry', EVENTS, ...rest);
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
