import {bindable, bindingMode} from 'aurelia-framework';

require('./context-menu.scss');

export class ContextMenu {
  @bindable open;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) onDelete;

  constructor() {
    this.open = false;
    this.onBodyClick = this.onBodyClick.bind(this);
  }

  toggleState() {
    this.open = !this.open;
    if (this.open) {
      this.registerBodyClickListener();
    } else {
      this.deregisterBodyClickListener();
    }
  }

  registerBodyClickListener() {
    setImmediate(() => {
      document.body.addEventListener('click', this.onBodyClick);
    });
  }

  deregisterBodyClickListener() {
    document.body.removeEventListener('click', this.onBodyClick);
  }

  onBodyClick() {
    this.open = false;
    this.deregisterBodyClickListener();
  }

  delete() {
    if (this.onDelete) {
      this.onDelete();
    }
  }

}
