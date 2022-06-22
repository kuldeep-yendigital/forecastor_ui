import { Confirm as ConfirmDialog } from './../dialog/confirm/';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { EVENTS as BOOKMARK_EVENTS, TYPES as BOOKMARK_TYPES } from './../../stores/bookmarkStore';
import { bindable, computedFrom, inject } from 'aurelia-framework';
import * as GLOBAL_EVENTS from './../../events';

require('./action.scss');

@inject(DialogService, EventAggregator)
export class Action {
  @bindable search;
  @bindable disableDelete = false;
  @bindable tooltipDirection;
  @bindable isPopular = false;
  @bindable parentid = 0;

  constructor(dialogService, eventAggregator) {
    this.ea             = eventAggregator;
    this.toggle         = this.toggle.bind(this);
    this.dialogService  = dialogService;
  }

  @computedFrom('search')
  get text() {
    return this.search.description || null;
  }

  delete() {
    this.dialogService.open({
      viewModel : ConfirmDialog,
      model     : {
        submit : 'Delete',
        text   : 'Are you sure you want to delete this saved search?'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        if (this.isPopular) {
          this.ea.publish(BOOKMARK_EVENTS.DELETE_POPULAR_BOOKMARK, { id: this.search.dbEntry.id, hash: this.search.dbEntry.hash, parentid: this.parentid });
        }
        else {
          this.ea.publish(BOOKMARK_EVENTS.DELETE_BOOKMARK, this.search.hash);
        }
      }
    });
  }

  share() {
    this.ea.publish(
      BOOKMARK_EVENTS.CREATE_BOOKMARK,
      { ... this.search, type : BOOKMARK_TYPES.SHARED }
    );
  }

  toggle() {
    this.helpExpanded = !this.helpExpanded;
  }
}
