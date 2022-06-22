import { DialogController } from 'aurelia-dialog';
import { inject, bindable } from 'aurelia-framework';

require('./index.scss');

@inject(DialogController)
export class CalculatedMetrics {
  @bindable select = {
    checked: true
  };

  constructor(dialogController) {
    this.controller = dialogController;

    this.controller.settings.lock = true;
    this.controller.settings.startingZIndex = 1001;
  }
}
