import {bindable} from 'aurelia-framework';

export class Child {
  @bindable id;
  @bindable item;
  @bindable select;
  @bindable onToggle;

  toggle() {
    this.onToggle && this.onToggle(this.id, this.select.checked);
  }
}
