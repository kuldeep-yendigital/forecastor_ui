import React from 'react';
import ReactDOM from 'react-dom';
import {
  noView,
  bindable,
  customElement
} from 'aurelia-framework';
import {
  decorators
} from 'aurelia-metadata';
import kebabCase from 'lodash/kebabCase';

export default function mountReact(component, name) {
  return decorators(
    noView(),
    customElement(name || kebabCase(component.name)),
    bindable({
      name: 'props',
      attribute: 'props',
      changeHandler: 'propsChanged',
      defaultBindingMode: 1,
    })).on(createCustomElementClass(component));
}

function createCustomElementClass(component) {
  return class ReactComponent {
    static inject() {
      return [Element];
    }

    constructor(element) {
      this.element = element;
      this.component = null;
    }

    propsChanged() {
      this.render();
    }

    bind() {
      this.render();
    }

    unbind() {
      ReactDOM.unmountComponentAtNode(this.element);
      this.component = null;
    }

    render() {
      this.component = ReactDOM.render(
        React.createElement(component, this.props),
        this.element
      );
    }
  };
}