import { bindable, bindingMode } from 'aurelia-framework';
import { ColumnStore } from '../../stores/columnStore';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as SortState from './SortState';
import { QueryStore } from '../../stores/queryStore';
import has from 'lodash/has';

require('./index.scss');

export class SortColumn {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnDataType;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnId;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnLabel;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnType;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) columnReadOnly;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnSorted;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnRemoved;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnPinned;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnUnpinned;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnMovedLeft;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onColumnMovedRight;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) isFiltered;
  @bindable columnId;

  static inject() {
    return [ColumnStore, QueryStore, EventAggregator];
  }

  constructor(ColumnStore, QueryStore, EventAggregator) {
    this.columnStore = ColumnStore;
    this.queryStore = QueryStore;
    this.eventAggregator = EventAggregator;
    this.queryStore.subscribe(this.onQueryChange.bind(this));
    this.onQueryChange();
  }

  onQueryChange() {
    if (!this.columnId) return;

    this.aggregable = !this.isColumnNumeric() && !this.columnReadOnly;
    this.sortable = !(this.isColumnNumeric() && this.queryStore.getSelectedMetricCount() > 1);
    this.pinnable = !this.isColumnNumeric();

    this.moveableLeft = this.columnStore.isMoveableLeft(this.columnId);
    this.moveableRight = this.columnStore.isMoveableRight(this.columnId);

    if(this.queryStore.data.sortedColumnId === this.columnId) {
      this.sortState = this.queryStore.data.sortDirection;
    }
    else {
      this.sortState = undefined;
    }

    this.isFiltered = this.isColumnFiltered();
  }

  isColumnFiltered() {
    return this.queryStore.data.columnFilters && has(this.queryStore.data.columnFilters, this.columnId);
  }

  isColumnNumeric() {
    return this.columnDataType === 'numeric';
  }

  columnDataTypeChanged() {
    this.onQueryChange();
  }

  columnReadOnlyChanged() {
    this.onQueryChange();
  }

  columnIdChanged() {
    this.onQueryChange();
  }

  onRemove() {
    this.sortState = undefined;
    if(this.onColumnRemoved) {
      this.onColumnRemoved(this.columnId);
    }
  }

  onPin() {
    this.onColumnPinned(this.columnId);
  }

  onUnpin() {
    this.onColumnUnpinned(this.columnId);
  }

  onMoveLeft() {
    this.onColumnMovedLeft(this.columnId);
  }

  onMoveRight() {
    this.onColumnMovedRight(this.columnId);
  }

  onSort(ascending) {
    if(this.onColumnSorted) {
      this.onColumnSorted({
        columnId: this.columnId,
        sortState: ascending ? SortState.sortedAscending : SortState.sortedDescending
      });
    }
  }
}
