import { Clipboard as ClipboardDialog } from './../clipboard/';
import { EVENTS as BOOKMARK_EVENTS, BookmarkStore, TYPES as BOOKMARK_TYPES } from './../../../stores/bookmarkStore';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import * as GLOBAL_EVENTS from './../../../events';
import { Router } from 'aurelia-router';
import { StoreComponent } from './../../store-component';

require('./index.scss');

const DIALOG_TYPE = {
  SAVE_SEARCH : 'save_search',
  SEARCH_LIST : 'search_list'
};

@inject(EventAggregator, DialogController, DialogService, BookmarkStore, Router)
export class SaveSearch extends StoreComponent {

  constructor(eventAggregator, dialogController, dialogService, bookmarkStore, router) {
    super(bookmarkStore, eventAggregator);

    this.bookmark      = {};
    this.controller    = dialogController;
    this.dialogService = dialogService;
    this.router        = router;

    this.onCreateBookmarkSuccess = this.onCreateBookmarkSuccess.bind(this);
    this.setDialogType(DIALOG_TYPE.SEARCH_LIST);
  }

  activate() {
    this.publish(BOOKMARK_EVENTS.FETCH_BOOKMARKS);
  }

  attached() {
    super.attached();
    this.subscribe(BOOKMARK_EVENTS.CREATE_BOOKMARK_SUCCESS, this.onCreateBookmarkSuccess);
  }

  open(search) {
    this.controller.cancel();
  }

  save() {
    this.bookmark.description = this.bookmark.description ? this.bookmark.description.trim() : '';
    this.bookmark.title       = this.bookmark.title ? this.bookmark.title.trim() : '';
    this.bookmark.type        = BOOKMARK_TYPES.SAVED;

    if (!this.bookmark.title) {
      return this.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, 'Please enter the search name');
    }

    return this.publish(BOOKMARK_EVENTS.CREATE_BOOKMARK, this.bookmark);
  }

  onCreateBookmarkSuccess(bookmark) {
    this.bookmark = {};
    this.setDialogType(DIALOG_TYPE.SEARCH_LIST);

    if (bookmark.type === BOOKMARK_TYPES.SHARED) {
      this.dialogService.open({
        viewModel : ClipboardDialog,
        model     : {
          message : 'The URL has been copied to your clipboard',
          text    : 'Your sharable URL:',
          value   : this.router.urlFor.grid({ s : `${bookmark.type}-${bookmark.hash}` })
        }
      });
    }
  }

  setDialogType(type) {
    this.dialogType = type;
  }

  share() {
    this.publish(
      BOOKMARK_EVENTS.CREATE_BOOKMARK,
      { description: '', title: Date.now().toString(), type : BOOKMARK_TYPES.SHARED }
    );
  }

  close() {
    this.controller.cancel();
  }
}
