import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'GeographyPanel_ParentRequested',
  CHILDREN_REQUESTED: 'GeographyPanel_ChildrenRequested',
  PARENT_SELECTED: 'GeographyPanel_ParentSelected',
  PARENT_UNSELECTED: 'GeographyPanel_ParentUnSelected',
  CHILD_SELECTED: 'GeographyPanel_ChildSelected',
  CHILD_UNSELECTED: 'GeographyPanel_ChildUnSelected',
  UNSELECT_ALL: 'GeographyPanel_unselect_all',
  SELECT_ALL: 'GeographyPanel_select_all'
};

export class GeographyStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Geography', 'geography', EVENTS, ...rest);
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
