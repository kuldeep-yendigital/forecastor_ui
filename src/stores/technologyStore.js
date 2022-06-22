import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'TechnologyPanel_ParentRequested',
  CHILDREN_REQUESTED: 'TechnologyPanel_ChildrenRequested',
  PARENT_SELECTED: 'TechnologyPanel_ParentSelected',
  PARENT_UNSELECTED: 'TechnologyPanel_ParentUnSelected',
  CHILD_SELECTED: 'TechnologyPanel_ChildSelected',
  CHILD_UNSELECTED: 'TechnologyPanel_ChildUnSelected',
  UNSELECT_ALL: 'TechnologyPanel_unselect_all',
  SELECT_ALL: 'TechnologyPanel_select_all'
};

export class TechnologyStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Technology', 'technology', EVENTS, ...rest);
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
