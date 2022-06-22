import { Clipboard as Clip } from './../../../helpers/clipboard';
import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import * as GLOBAL_EVENTS from './../../../events';

require('./index.scss');

@inject(DialogController, EventAggregator)
export class Clipboard {

  constructor(dialogController, eventAggregator) {
    this.controller = dialogController;
    this.ea         = eventAggregator;
    this.model      = {
      message : undefined,
      reset   : 'Close',
      submit  : 'Copy & close',
      text    : 'What you gonna do?',
      value   : 'Copy me!'
    }

    this.controller.settings.lock = true;
  }

  activate(model) {
    if (model.hasOwnProperty('message'))
      this.model.message = model.message;

    if (model.hasOwnProperty('reset'))
      this.model.reset = model.reset;

    if (model.hasOwnProperty('submit'))
      this.model.submit = model.submit;

    if (model.hasOwnProperty('text'))
      this.model.text = model.text;

    if (model.hasOwnProperty('value'))
      this.model.value = model.value;
  }

  toClipboard() {
    if(Clip.copy(this.model.value) && this.model.message)
      this.ea.publish(GLOBAL_EVENTS.POPULATE_SYSTEM_MESSAGE, this.model.message);

    this.controller.ok();
  }
}
