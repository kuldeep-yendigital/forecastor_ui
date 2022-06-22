import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import { HELP_TEXT } from './help-text';

describe('Taxonomy Help', () => {
  let component, model;

  beforeEach(done => {
    model = { taxonomy: '' };
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/tooltip/index'))
      .inView(`<tooltip taxonomy={taxonomy}></tooltip>`)
      .boundTo({});

    component.create(bootstrap).then(() => {
    }).then(done).catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('With no help text', () => {
    it('does not render icon', () => {
      expect(document.querySelector('.icon')).toEqual(null);
    });
  });

  describe('With help text', () => {
    beforeEach((done) => {
      component.viewModel.taxonomy = Object.keys(HELP_TEXT)[0];
      setImmediate(() => { done(); });
    });

    it('renders icon', () => {
      expect(document.querySelector('.icon')).not.toEqual(null);
    });

    it('is collapsed by default', () => {
      expect(component.viewModel.expanded).toEqual(undefined);
      expect(document.querySelector('.content').getAttribute('class')).toContain('aurelia-hide');
    });

    it('opens when clicking the icon', (done) => {
      document.querySelector('.icon').click();

      setImmediate(() => {
        expect(component.viewModel.expanded).toEqual(true);
        expect(document.querySelector('.content')).not.toEqual(null);
        done();
      });
    });

    it('renders help text in content', (done) => {
      document.querySelector('.icon').click();

      setImmediate(() => {
        expect(document.querySelector('.content').textContent.trim())
          .toEqual(HELP_TEXT[component.viewModel.taxonomy]);
        done();
      });
    });

    it('renders to the right with left arrow pointing by default', () => {
      expect(document.querySelector('.content').getAttribute('class')).toContain('right');
      expect(document.querySelector('.content').getAttribute('class')).toContain('left-arrow');
    });

    it('renders to the left with right arrow pointing', (done) => {
      component.viewModel.direction = 'left';

      setImmediate(() => {
        expect(document.querySelector('.content').getAttribute('class')).toContain('left');
        expect(document.querySelector('.content').getAttribute('class')).toContain('right-arrow');
        done();
      });
    });

  });
});
