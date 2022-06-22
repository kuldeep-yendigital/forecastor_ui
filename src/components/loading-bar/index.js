import { bindable } from 'aurelia-framework';

require('./index.scss');

export class LoadingPanel {
  @bindable action;

  constructor() {
    this.text = 'Loading, please wait';
  }

  activate(model) {
    if (!model) return;

    if (model.hasOwnProperty('text'))
      this.text = model.text;
  }

  click(event) {
    this.action(event);
  }
}
