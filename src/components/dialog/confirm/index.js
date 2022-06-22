import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';

require('./index.scss');

@inject(DialogController)
export class Confirm {

  constructor(dialogController) {
    this.controller = dialogController;
    this.model      = {
      reset  : 'Cancel',
      submit : 'OK',
      text   : 'Click OK to donate your liver.'
    }

    this.controller.settings.lock = true;
    this.controller.settings.startingZIndex = 1001;
  }

  activate(model) {
    if (model.hasOwnProperty('reset'))
      this.model.reset = model.reset;

    if (model.hasOwnProperty('submit'))
      this.model.submit = model.submit;

    if (model.hasOwnProperty('text'))
      this.model.text = model.text;
  }
}
