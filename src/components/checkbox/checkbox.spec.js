import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

describe('Checkbox', () => {
  let component, model;

  beforeEach(done => {
    model = {selectModel: {}, callback: () => {} };

    component = StageComponent
      .withResources(PLATFORM.moduleName('components/checkbox/checkbox'))
      .inView('<checkbox selector="aCheckbox" text="check me" select.bind="selectModel" callback.call="callback()"></checkbox>')
      .boundTo(model);

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Initialise', () => {
    it('creates input and checkbox with matching id and for attributes', () => {
      const input = document.querySelector('input');
      const label = document.querySelector('label');

      expect(input.getAttribute('type')).toEqual('checkbox');
      expect(input.getAttribute('id')).toEqual('aCheckbox');
      expect(input.getAttribute('class')).toContain('filled-in');
      expect(label.getAttribute('for')).toEqual('aCheckbox');
    });

    it('renders label text', () => {
      const label = document.querySelector('label');

      expect(label.textContent).toEqual('check me');
    });
  });

  describe('Interaction', () => {
    it('adds a checked indicator to bound model', (done) => {
      const input = document.querySelector('input');

      expect(model.selectModel.checked).toBeUndefined();

      input.click();

      setImmediate(() => {
        expect(model.selectModel.checked).toEqual(true);

        input.click();

        setImmediate(() => {
          expect(model.selectModel.checked).toEqual(false);

          done();
        });
      });
    });

    it('triggers callback on change', (done) => {
      model.callback = () => { done(); };

      document.querySelector('input').click();
    });
  });
});
