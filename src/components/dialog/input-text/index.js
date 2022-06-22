import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { EVENTS as BOOKMARK_EVENTS, BookmarkStore, TYPES as BOOKMARK_TYPES } from './../../../stores/bookmarkStore';

require('./index.scss');

@inject(DialogController)
export default class InputText {

  constructor(dialogController) {
    this.controller = dialogController;
    this.model      = {
      reset  : 'Cancel',
      submit : 'OK',
      inputs: [],
      width: 500,
      id: null,
      onSubmit : (input) => console.log(`Value is ${input}`)
    };

    this.controller.settings.lock = true;
    this.controller.settings.startingZIndex = 1001;
  }

  submit() {
    const result = this.model.inputs.map(el => el.value);
    if (this.model.id) {
      result.push(this.model.id);
    }
    this.model.onSubmit(result);
    this.controller.cancel();
  }

  activate(model) {
    if (model.hasOwnProperty('reset'))
      this.model.reset = model.reset;

    if (model.hasOwnProperty('submit'))
      this.model.submit = model.submit;

    if (model.hasOwnProperty('inputs'))
      this.model.inputs = model.inputs;

    if (model.hasOwnProperty('onSubmit'))
      this.model.onSubmit = model.onSubmit;

    if (model.hasOwnProperty('width'))
      this.model.width = model.width;

    if (model.hasOwnProperty('id'))
      this.model.id = model.id;
  }
}
