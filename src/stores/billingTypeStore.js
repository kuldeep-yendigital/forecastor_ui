import * as GLOBAL_EVENTS from '../events';
import {HierarchicalDimensionStore} from './hierarchicalDimensionStore';

export const EVENTS = {
  PARENT_REQUESTED: 'BillingTypePanel_ParentRequested',
  CHILDREN_REQUESTED: 'BillingTypePanel_ChildrenRequested',
  PARENT_SELECTED: 'BillingTypePanel_ParentSelected',
  PARENT_UNSELECTED: 'BillingTypePanel_ParentUnSelected',
  CHILD_SELECTED: 'BillingTypePanel_ChildSelected',
  CHILD_UNSELECTED: 'BillingTypePanel_ChildUnSelected',
  UNSELECT_ALL: 'BillingTypePanel_unselect_all',
  SELECT_ALL: 'BillingTypePanel_select_all'
};

export class BillingTypeStore extends HierarchicalDimensionStore {
  constructor(...rest) {
    super('Billing Type', 'billingtype', EVENTS, ...rest);
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
