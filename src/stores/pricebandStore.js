import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'PricebandPanel_ParentRequested',
  CHILDREN_REQUESTED: 'PricebandPanel_ChildrenRequested',
  PARENT_SELECTED: 'PricebandPanel_ParentSelected',
  PARENT_UNSELECTED: 'PricebandPanel_ParentUnSelected',
  CHILD_SELECTED: 'PricebandPanel_ChildSelected',
  CHILD_UNSELECTED: 'PricebandPanel_ChildUnSelected',
  UNSELECT_ALL: 'PricebandPanel_unselect_all',
  SELECT_ALL: 'PricebandPanel_select_all'
};

export class PricebandStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Priceband', 'priceband', EVENTS, ...rest);
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
