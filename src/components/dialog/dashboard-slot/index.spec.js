import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {EVENTS as DASHBOARD_EVENTS} from '../../../stores/dashboardStore';

describe('Dashboard Slot Dialog', () => {
  let component, viewModel;

  beforeEach(done => {
    viewModel = {};
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/dialog/dashboard-slot/index'))
      .inView('<dashboard-slot></dashboard-slot>')
      .boundTo(viewModel);

    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
    });

    component.create(bootstrap)
      .then(done)
      .catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  it('is loading until the dashboard store has been populated', done => {
    expect(document.querySelector('[data-selector~="slots-loading"]')).toBeTruthy();
    component.viewModel.loaded = true;
    setImmediate(() => {
      expect(document.querySelector('[data-selector~="slots-loading"]')).toBeFalsy();
      done();
    });
  });

  describe('save slot', () => {

    beforeEach(done => {
      component.viewModel.loaded = true;
      setImmediate(done);
    });

    it('prompts for a title for the dashboard slot', () => {
      expect(document.querySelector('[data-selector~="slot-title"]')).toBeTruthy();
    });

    it('updates the title according to the typed text', () => {
      const title = 'Slot title ' + Math.floor(Math.random() * 1000);
      const titleInput = document.querySelector('[data-selector~="slot-title"]');
      titleInput.value = title;
      titleInput.dispatchEvent(new Event('change'));
      setImmediate(() => {
        expect(component.viewModel.title).toEqual(title);
      });
    });

    it('updates the description according to the typed text', () => {
      const description = 'Description ' + Math.floor(Math.random() * 1000);
      const descriptionInput = document.querySelector('[data-selector~="slot-description"]');
      descriptionInput.value = description;
      descriptionInput.dispatchEvent(new Event('change'));
      setImmediate(() => {
        expect(component.viewModel.description).toEqual(description);
      });
    });

    it('saves the slot on clicking save', done => {
      const title = 'Slot title ' + Math.floor(Math.random() * 1000);
      const description = 'Description ' + Math.floor(Math.random() * 1000);
      const titleInput = document.querySelector('[data-selector~="slot-title"]');
      const descriptionInput = document.querySelector('[data-selector~="slot-description"]');
      const saveButton = document.querySelector('[data-selector~="save-slot"]');
      spyOn(component.viewModel.eventAggregator, 'publish');
      spyOn(component.viewModel.dialogController, 'ok');
      titleInput.value = title;
      descriptionInput.value = description;
      titleInput.dispatchEvent(new Event('change'));
      descriptionInput.dispatchEvent(new Event('change'));
      setImmediate(() => {
        saveButton.dispatchEvent(new Event('click'));
        expect(component.viewModel.dialogController.ok).toHaveBeenCalled();
        expect(component.viewModel.eventAggregator.publish).toHaveBeenCalledWith(DASHBOARD_EVENTS.SAVE_SLOT, {
          title,
          description
        });
        done();
      });
    });
  });

  describe('replace slot', () => {

    beforeEach(done => {
      component.viewModel.slots = [
        {title: 'Slot A'},
        {title: 'Slot B'},
        {title: 'Slot C'},
        {title: 'Slot D'}
      ];
      component.viewModel.full = true;
      component.viewModel.loaded = true;
      setImmediate(done);
    });

    it('prompts to replace an existing slot when the dashboard is full', () => {
      expect(document.querySelector('[data-selector~="slot-radio"]')).toBeTruthy();
    });

    it('updates the selected index when an option is selected', done => {
      const radios = document.querySelectorAll('[data-selector~="slot-radio"]');
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change'));
      setImmediate(() => {
        expect(component.viewModel.selectedRadio).toEqual(1);
        done();
      });
    });

    it('updates the slot selected when replace button is clicked', done => {
      const radios = document.querySelectorAll('[data-selector~="slot-radio"]');
      const replaceButton = document.querySelector('[data-selector~="replace-slot"]');
      radios[2].checked = true;
      radios[2].dispatchEvent(new Event('change'));
      replaceButton.dispatchEvent(new Event('click'));
      setImmediate(() => {
        expect(component.viewModel.selectedSlot).toEqual(2);
        done();
      });
    });

    it('prompts for a title for the new slot after a slot to replace is selected', done => {
      component.viewModel.selectedSlot = 2;
      setImmediate(() => {
        expect(document.querySelector('[data-selector~="slot-title"]')).toBeTruthy();
        done();
      });
    });

    it('replaces the slot on clicking save', done => {
      const index = 2;
      component.viewModel.selectedSlot = index;
      setImmediate(() => {
        const title = 'Slot title ' + Math.floor(Math.random() * 1000);
        const description = 'Description ' + Math.floor(Math.random() * 1000);
        const titleInput = document.querySelector('[data-selector~="slot-title"]');
        const descriptionInput = document.querySelector('[data-selector~="slot-description"]');
        const saveButton = document.querySelector('[data-selector~="save-slot"]');
        spyOn(component.viewModel.eventAggregator, 'publish');
        spyOn(component.viewModel.dialogController, 'ok');
        titleInput.value = title;
        descriptionInput.value = description;
        titleInput.dispatchEvent(new Event('change'));
        descriptionInput.dispatchEvent(new Event('change'));
        setImmediate(() => {
          saveButton.dispatchEvent(new Event('click'));
          expect(component.viewModel.dialogController.ok).toHaveBeenCalled();
          expect(component.viewModel.eventAggregator.publish).toHaveBeenCalledWith(DASHBOARD_EVENTS.REPLACE_SLOT, {
            index,
            title,
            description
          });
          done();
        });
      });
    });
  });
});
