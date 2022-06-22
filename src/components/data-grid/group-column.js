import { bindable } from 'aurelia-framework';

require('./../sort-column/index.scss');

export class GroupColumn {
  @bindable columnId;
  @bindable columnLabel;
}
