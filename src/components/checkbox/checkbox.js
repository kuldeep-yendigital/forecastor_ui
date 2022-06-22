import { bindable, bindingMode } from 'aurelia-framework';

require('./checkbox.scss');

export class Checkbox {
  @bindable selector;
  @bindable text;
  @bindable select;
  @bindable readOnly;
  @bindable callback;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) oneWay;

  triggerCallback() {
    if (this.callback && this.callback.call) {
      this.callback();
    }
  }
}
