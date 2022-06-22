import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'DevicePanel_ParentRequested',
  CHILDREN_REQUESTED: 'DevicePanel_ChildrenRequested',
  PARENT_SELECTED: 'DevicePanel_ParentSelected',
  PARENT_UNSELECTED: 'DevicePanel_ParentUnSelected',
  CHILD_SELECTED: 'DevicePanel_ChildSelected',
  CHILD_UNSELECTED: 'DevicePanel_ChildUnSelected',
  UNSELECT_ALL: 'DevicePanel_unselect_all',
  SELECT_ALL: 'DevicePanel_select_all'
};

export class DeviceStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Device', 'device', EVENTS, ...rest);
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
