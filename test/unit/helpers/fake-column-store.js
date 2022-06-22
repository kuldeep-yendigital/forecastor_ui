import Store from '../../../src/stores/store';

export class FakeColumnStore extends Store {
  constructor() {
    super();

    this.data = { columns: [
      {display: 'field1', field: 'field1_field', parent: 'group1', checked: true},
      {display: 'field2', field: 'field2_field', parent: 'group1', checked: true},
      {display: 'field3', field: 'companyname_name', parent: 'group2', checked: true}
    ] };
  }
  get EVENTS() { return []; }
  subscribe() {}
  getDefaultState() {
    return this.data;
  }
  getColumns() { return []; }
  hasSameColumns() { return false; }
  getGroups() { return []; }
}
