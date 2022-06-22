import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {ActiveFilterStore} from "../../stores/activeFilterStore";
import {selector} from '../../../test/unit/helpers/selector';

describe('Active filter', () => {

  let component;
  let fakeActiveFilterStore;

  beforeEach(done => {

    fakeActiveFilterStore = {
      data: {},
      subscribe: () => {}
    };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/active-filter/index'))
      .inView('<active-filter></active-filter>');

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(ActiveFilterStore, fakeActiveFilterStore);
    });

    component.create(bootstrap).then(() => done()).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Active filter hierarchy', () => {
    it('displays the active filter hierarchy', done => {

      fakeActiveFilterStore.data = {
        hierarchy: [
          { name: 'Metric', children: [] }
        ]
      };

      component.viewModel.activeFiltersChanged();

      setTimeout(() => {
        expect(document.querySelector(
          selector('active-filter|Metric')
        )).not.toBeNull();
        done();
      });
    });

    it('displays complex filter hierarchy', done => {

      fakeActiveFilterStore.data = {
        hierarchy: [
          { name: 'Metric', children: [
            { name: 'Subscriptions', children: [] },
            { name: 'CAPEX', children: [] },
            { name: 'EBT', children: [] }
          ] },
          { name: 'Technology', children: [
            { name: 'Wireless', children: [
              { name: 'Cellular', children: [
                { name: '3G', children: [] }
              ] }
            ] }
          ] }
        ]
      };

      component.viewModel.activeFiltersChanged();

      setTimeout(() => {
        expect(document.querySelector(
          selector('active-filter|Metric|Subscriptions')
        )).not.toBeNull();
        expect(document.querySelector(
          selector('active-filter|Technology|Wireless|Cellular|3G')
        )).not.toBeNull();
        done();
      });
    });

    it('unchecks all children if parent is unchecked', done => {
      fakeActiveFilterStore.data = {
        hierarchy: [
          { name: 'Metric', children: [
            { name: 'Subscriptions', children: [] },
            { name: 'CAPEX', children: [] },
            { name: 'EBT', children: [] }
          ] }
        ]
      };

      component.viewModel.activeFiltersChanged();

      setTimeout(() => {
        const allCheckboxes = Array.from(document.querySelectorAll(
          `${selector('active-filter|Metric')} checkbox input`
        ));
        const parentCheckbox = allCheckboxes[0];
        expect(allCheckboxes.map(checkbox => checkbox.checked)).toEqual([
          true,
            true,
            true,
            true
        ]);

        parentCheckbox.click();

        setTimeout(() => {
          expect(allCheckboxes.map(checkbox => checkbox.checked)).toEqual([
            false,
              false,
              false,
              false
          ]);
          done();
        });
      });
    });
  });

  describe('Search within panel', () => {
    // Filters the list to only matching filters, based on a text
    // contains search and matching items parents.
    it('displays only the filters matching the term', done => {
      fakeActiveFilterStore.data = {
        hierarchy: [
          { name: 'Metric', children: [
            { name: 'Subscriptions', children: [] },
            { name: 'CAPEX', children: [] },
            { name: 'EBT', children: [] }
          ] },
          { name: 'Technology', children: [
            { name: 'Wireless', children: [
              { name: 'Cellular', children: [
                { name: '3G', children: [] }
              ] }
            ] }
          ] }
        ]
      };

      component.viewModel.activeFiltersChanged();

      const searchInput = document.querySelector(selector('active-filter|search'));
      searchInput.value = '3G';
      searchInput.dispatchEvent(new Event('change'));

      component.viewModel.searchChanged();

      setTimeout(() => {
        const visible = Array.from(document.querySelectorAll('.active-filter-child-visible'))
          .map(element => element.dataset.selector);
        expect(visible).toEqual(['Technology', 'Wireless', 'Cellular', '3G']);
        done();
      });
    })
  });
});
