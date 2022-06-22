import { bindable, BindingEngine } from 'aurelia-framework';

require('./index.scss');

export class RibbonPanel {

  @bindable panelData;
  @bindable disabled;

  static inject() {
    return [BindingEngine];
  }

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
  }

  onModelChange(newValue) {
    if (newValue) {
      this.panelName = `${newValue.dimension.toLowerCase()}-panel`;
    }
  }

  attached() {
    this.modelBinding = this.bindingEngine.propertyObserver(this, 'panelData').subscribe(this.onModelChange.bind(this));
  }

  detached() {
    this.modelBinding.dispose();
  }
}
