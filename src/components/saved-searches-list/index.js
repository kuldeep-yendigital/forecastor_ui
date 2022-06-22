import { EVENTS as BOOKMARK_EVENTS } from './../../stores/bookmarkStore';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { inject, bindable } from 'aurelia-framework';
import InputTextDialog from '../dialog/input-text';
import { DialogController } from 'aurelia-dialog';
import { DialogService } from 'aurelia-dialog';

import './index.scss';

@inject(EventAggregator, Router, DialogController, DialogService)
export class SavedSearchesList {
  @bindable data = [];
  @bindable allbookmarks = [];
  @bindable admin = false;
  @bindable parentid = 0;

  constructor(eventAggregator, router, dialogController, dialogService) {
    this.dialogService = dialogService;
    this.ea = eventAggregator;
  }

  get showAddButton() {
    return (this.admin && this.parentid > 0);
  }

  addSubCategory() {
    this.dialogService.open({
      viewModel : InputTextDialog,
      model     : {
        inputs: [
          { text    : 'Please enter the subcategory name:', value: '' }
        ],
        onSubmit: (value) => this.saveAddSubCategory(value)
      }
    });
  }

  saveAddSubCategory([title]) {
    this.ea.publish(BOOKMARK_EVENTS.CREATE_SUBCATEGORY, { title: title, parentid: this.parentid });
  }

  deleteSubCategory({ id }) {
    this.ea.publish(BOOKMARK_EVENTS.DELETE_SUBCATEGORY, [id, this.parentid]);
  }

  editSubCategory({ id, title }) {
    this.dialogService.open({
      viewModel : InputTextDialog,
      model     : {
        inputs: [
          { text    : 'Subcategory Name:', value: title }
        ],
        id: id,
        onSubmit: (value) => this.saveEditSubCategory(value)
      }
    });
  }

  saveEditSubCategory([title, id]) {
    this.ea.publish(BOOKMARK_EVENTS.EDIT_SUBCATEGORY, { id: id, newData: { title }});
  }
}
