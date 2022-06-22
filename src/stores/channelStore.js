import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'ChannelPanel_ParentRequested',
  CHILDREN_REQUESTED: 'ChannelPanel_ChildrenRequested',
  PARENT_SELECTED: 'ChannelPanel_ParentSelected',
  PARENT_UNSELECTED: 'ChannelPanel_ParentUnSelected',
  CHILD_SELECTED: 'ChannelPanel_ChildSelected',
  CHILD_UNSELECTED: 'ChannelPanel_ChildUnSelected',
  UNSELECT_ALL: 'ChannelPanel_unselect_all',
  SELECT_ALL: 'ChannelPanel_select_all'
};

export class ChannelStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Channel', 'channel', EVENTS, ...rest);
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
