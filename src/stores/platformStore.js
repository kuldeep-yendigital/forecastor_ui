import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'PlatformPanel_ParentRequested',
  CHILDREN_REQUESTED: 'PlatformPanel_ChildrenRequested',
  PARENT_SELECTED: 'PlatformPanel_ParentSelected',
  PARENT_UNSELECTED: 'PlatformPanel_ParentUnSelected',
  CHILD_SELECTED: 'PlatformPanel_ChildSelected',
  CHILD_UNSELECTED: 'PlatformPanel_ChildUnSelected',
  UNSELECT_ALL: 'PlatformPanel_unselect_all',
  SELECT_ALL: 'PlatformPanel_select_all'
};

export class PlatformStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Platform', 'platform', EVENTS, ...rest);
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
