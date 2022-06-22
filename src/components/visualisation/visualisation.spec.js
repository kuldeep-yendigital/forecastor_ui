/* global describe, expect, it, beforeEach, PLATFORM */
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { AuthStore } from '../../stores/authStore';
import { SelectionStore } from '../../stores/selectionStore';
import { QueryStore } from '../../stores/queryStore';
import { GraphStore } from '../../stores/graphStore';
import { FakeAuthStore, FakeDataStore } from '../../../test/unit/helpers/fakes';

describe('Visualisation', () => {
  let component;
  let model;
  let fakeDataStore;
  let fakeQueryStore;
  let fakeAuthStore;
  let isExportEnabled;

  beforeEach((done) => {
    model = {
      type: 'scatter'
    };

    fakeDataStore = new FakeDataStore();
    fakeDataStore.data.records = [];
    fakeDataStore.subscribe = () => {};

    fakeQueryStore = {
      data: {
        range: {
          interval: 'yearly'
        }
      }
    };
    fakeAuthStore = new FakeAuthStore();
    fakeAuthStore.isExportEnabled = () => isExportEnabled;

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/visualisation/visualisation'))
      .inView('<visualisation type.bind="type"></visualisation>')
      .boundTo(model);

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(SelectionStore, {
        subscribe: () => ({ dispose: () => {} }),
        data: {
          records: []
        }
      });
      aurelia.container.registerInstance(QueryStore, fakeQueryStore);
      aurelia.container.registerInstance(AuthStore, fakeAuthStore);
      aurelia.container.registerInstance(GraphStore, {
        subscribe: () => ({ dispose: () => {} }),
        data: {
          type: 'line'
        }
      });
    });

    component.create(bootstrap).then(done).catch(done.fail);
  });

  describe('Plot', () => {
    it('should pass layout configuration', () => {
      expect(component.viewModel.visualisation.layout).toEqual(jasmine.objectContaining({
        hovermode: 'closest',
        margin: {
          t: 50,
          r: 50
        },
        showlegend: true,
        legend: {
          orientation: 'h'
        },
        barmode: null
      }));
    });

    it('has the layout tickformat including year and month for quarterly data', done => {
      fakeQueryStore.data.range.interval = 'quarterly';
      component.viewModel.refreshData();
      setImmediate(() => {
        expect(component.viewModel.visualisation.layout).toEqual(jasmine.objectContaining({
          autosize: true,
          barmode: null,
          height: 450,

          margin: {
            t: 50,
            r: 50
          },
          showlegend: true,
          legend: {
            orientation: 'h'
          },
          xaxis: jasmine.objectContaining({
            autorange: true,
            type: 'date',
            tickformat: '%Y %b'
          })
        }));
        done();
      });
    });

    it('should maintain column order in the series name', (done) => {
      component.viewModel.selectionStore.data.records = [
        {
          one: 1,
          two: 2,
          three: 3,
          datapoints: [],
          checked: true
        }
      ];
      fakeQueryStore.data.columnKeys = ['one', 'two', 'three'];

      component.viewModel.refreshData();

      setImmediate(() => {
        expect(component.viewModel.visualisation.plots[0].name).toBe('1 | 2 | 3');
        done();
      });
    });

    it('should only plot checked columns', (done) => {
      component.viewModel.selectionStore.data.records = [
        {
          record: 'One',
          datapoints: []
        },
        {
          record: 'Three',
          datapoints: []
        }
      ];

      fakeQueryStore.data.columnKeys = ['record'];
      component.viewModel.refreshData();

      setImmediate(() => {
        expect(component.viewModel.visualisation.plots.length).toBe(2);
        expect(component.viewModel.visualisation.plots[0].name).toBe('One');
        expect(component.viewModel.visualisation.plots[1].name).toBe('Three');

        done();
      });
    });

    it('should order series by dates ascending', (done) => {
      fakeQueryStore.data.columnKeys = ['record'];

      component.viewModel.selectionStore.data.records = [
        {
          record: 'One',
          datapoints: [
            {
              month: '31/03/2017',
              value: 1
            },
            {
              month: '01/10/2016',
              value: 2
            },
            {
              month: '01/10/2017',
              value: 3
            }
          ],
          checked: true
        }
      ];

      component.viewModel.refreshData();

      setImmediate(() => {
        expect(component.viewModel.visualisation.plots.length).toEqual(1);
        expect(component.viewModel.visualisation.plots[0].x).toEqual(['2016', '2017', '2017']);
        expect(component.viewModel.visualisation.plots[0].y).toEqual([2, 1, 3]);

        // Don't mutate original datapoints
        expect(component.viewModel.selectionStore.data.records[0].datapoints)
          .toEqual([
            {
              month: '31/03/2017',
              value: 1
            },
            {
              month: '01/10/2016',
              value: 2
            },
            {
              month: '01/10/2017',
              value: 3
            }
          ]);
        done();
      });
    });

    it('includes the month in the xaxis for quarterly data', done => {
      fakeQueryStore.data.columnKeys = ['record'];
      fakeQueryStore.data.range.interval = 'quarterly';

      component.viewModel.selectionStore.data.records = [
        {
          record: 'One',
          datapoints: [
            {
              month: '31/03/2017',
              value: 1
            },
            {
              month: '01/10/2016',
              value: 2
            },
            {
              month: '01/10/2017',
              value: 3
            }
          ],
          checked: true
        }
      ];

      component.viewModel.refreshData();
      setImmediate(() => {
        expect(component.viewModel.visualisation.plots.length).toEqual(1);
        expect(component.viewModel.visualisation.plots[0].x).toEqual(['2016-10', '2017-03', '2017-10']);
        expect(component.viewModel.visualisation.plots[0].y).toEqual([2, 1, 3]);

        // Don't mutate original datapoints
        expect(component.viewModel.selectionStore.data.records[0].datapoints)
          .toEqual([
            {
              month: '31/03/2017',
              value: 1
            },
            {
              month: '01/10/2016',
              value: 2
            },
            {
              month: '01/10/2017',
              value: 3
            }
          ]);
        done();
      });
    })
  });
});
