import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import { EVENTS as CONTEXT_EVENTS } from '../context-menu';

describe('Context menu', () => {
  let component, model;

  beforeEach(done => {
    model = {
      data: {}
    };
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/context-menu/index'))
      .inView(`
        <context-menu
          is-aggregable.two-way="data.aggregable"
          is-pinnable.two-way="data.pinnable"
          is-sortable.two-way="data.sortable"></context-menu>
      `)
      .boundTo(model);

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });


  describe('Interaction', () => {
    let ellipsis;

    beforeEach(() => {
      ellipsis = document.querySelector('[data-selector="ellipsis"]');
    });

    it('opens when clicking the ellipsis', () => {
      ellipsis.click();
      expect(component.viewModel.open).toEqual(true);
    });

    it('does NOT close when clicking inside the menu', done => {
      ellipsis.click();
      expect(component.viewModel.open).toEqual(true);
      const menuContainer = document.querySelector('[data-selector="context-menu-popup"]');
      menuContainer.click();
      setImmediate(() => {
        expect(component.viewModel.open).toEqual(true);
        done();
      });

    });

    it('closes when clicking off the menu', done => {
      ellipsis.click();
      expect(component.viewModel.open).toEqual(true);
      setImmediate(() => {
        document.body.click();
        setImmediate(() => {
          expect(component.viewModel.open).toEqual(false);
          done();
        });
      });
    });

    it('closes when clicking inside the menu and then clicking off the menu', done => {
      ellipsis.click();
      expect(component.viewModel.open).toEqual(true);
      const menuContainer = document.querySelector('[data-selector="context-menu-popup"]');
      setImmediate(() => {
        menuContainer.click();
        document.body.click();
        setImmediate(() => {
          expect(component.viewModel.open).toEqual(false);
          done();
        });
      });
    });
  });

  describe('Callbacks', () => {
    it('calls sort with the correct direction', () => {
      const spy = spyOn(component.viewModel, 'sort');
      document.querySelector('[data-selector="sort-column-asc"]').click();
      expect(spy).toHaveBeenCalledWith(true);
      document.querySelector('[data-selector="sort-column-desc"]').click();
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('calls remove', () => {
      const spy = spyOn(component.viewModel, 'remove');
      document.querySelector('[data-selector="remove-column"]').click();
      expect(spy).toHaveBeenCalled();
    });

    it('calls pin', () => {
      const spy = spyOn(component.viewModel, 'togglePin');
      document.querySelector('[data-selector="pin-column"]').click();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should listen for the context open event', done => {
      const spy = spyOn(component.viewModel.eventAggregator, 'publish');
      component.viewModel.open = true;
      component.viewModel.registerBodyListener();
      setImmediate(() => {
        expect(spy).toHaveBeenCalledWith(CONTEXT_EVENTS.CONTEXT_MENU_OPEN, component.viewModel);
        done();
      });
    });

    it('should NOT close if the reference in event is itself', () => {
      const spy = spyOn(component.viewModel, 'close');
      component.viewModel.eventAggregator.publish(CONTEXT_EVENTS.CONTEXT_MENU_OPEN, component.viewModel);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should close if the reference in event is not itself', () => {
      const spy = spyOn(component.viewModel, 'close');
      component.viewModel.eventAggregator.publish(CONTEXT_EVENTS.CONTEXT_MENU_OPEN, {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Aggregable', () => {
    it('does not allow remove column if non aggregable', (done) => {
      model.data = {
        aggregable: false
      };
      setImmediate(() => {
        const removeColumn = document.querySelector('[data-selector="remove-column"]');
        const onRemove = spyOn(component.viewModel, 'onRemove');
        expect(removeColumn.classList.contains('disabled')).toBeTruthy();
        removeColumn.click();
        expect(onRemove).not.toHaveBeenCalled();
        done();
      });
    });

    it('allows remove column if aggregable', (done) => {
      model.data = {
        aggregable: true
      };
      setImmediate(() => {
        const removeColumn = document.querySelector('[data-selector="remove-column"]');
        const onRemove = spyOn(component.viewModel, 'onRemove');
        expect(removeColumn.classList.contains('disabled')).toBeFalsy();
        removeColumn.click();
        expect(onRemove).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Pinnable', () => {
    it('does not allow pinning if non pinnable', (done) => {
      model.data = {
        pinnable: false
      };
      setImmediate(() => {
        const pinColumn = document.querySelector('[data-selector="pin-column"]');
        const onPin = spyOn(component.viewModel, 'onPin');
        expect(pinColumn.classList.contains('disabled')).toBeTruthy();
        pinColumn.click();
        expect(onPin).not.toHaveBeenCalled();
        done();
      });
    });

    it('allows pinning if pinnable', (done) => {
      model.data = {
        pinnable: true
      };
      setImmediate(() => {
        const pinColumn = document.querySelector('[data-selector="pin-column"]');
        const onPin = spyOn(component.viewModel, 'onPin');
        expect(pinColumn.classList.contains('disabled')).toBeFalsy();
        pinColumn.click();
        expect(onPin).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Sortable', () => {
    it('does not allow sort if non sortable', (done) => {
      model.data = {
        sortable: false
      };
      setImmediate(() => {
        const sortColumnAsc = document.querySelector('[data-selector="sort-column-asc"]');
        const sortColumnDesc = document.querySelector('[data-selector="sort-column-desc"]');
        const onSort = spyOn(component.viewModel, 'onSort');
        expect(sortColumnAsc.classList.contains('disabled')).toBeTruthy();
        expect(sortColumnDesc.classList.contains('disabled')).toBeTruthy();
        sortColumnAsc.click();
        expect(onSort).not.toHaveBeenCalled();
        sortColumnDesc.click();
        expect(onSort).not.toHaveBeenCalled();
        done();
      });
    });

    it('allows sort if sortable', (done) => {
      model.data = {
        sortable: true
      };
      setImmediate(() => {
        const sortColumnAsc = document.querySelector('[data-selector="sort-column-asc"]');
        const sortColumnDesc = document.querySelector('[data-selector="sort-column-desc"]');
        const onSort = spyOn(component.viewModel, 'onSort');
        expect(sortColumnAsc.classList.contains('disabled')).toBeFalsy();
        expect(sortColumnDesc.classList.contains('disabled')).toBeFalsy();
        sortColumnAsc.click();
        expect(onSort).toHaveBeenCalled();
        sortColumnDesc.click();
        expect(onSort).toHaveBeenCalled();
        done();
      });
    });
  });
});
