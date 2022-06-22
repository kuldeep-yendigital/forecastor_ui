export class FakeDataService {
  fetch () { return Promise.resolve({
    records: [],
    sortRecordKeys: []
  }); }
}
