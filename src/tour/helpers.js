const hopscotch = require('hopscotch');
const tourConfig = require('./config/forecaster-welome-tour-01');

const activeClass = 'active';
const highlightId = 'tour-highlight';
const history = [];
const maskId = 'tour-mask';

hopscotch.listen('show', clearHistory);
hopscotch.registerHelper('dynamicField', () => {
  const currentTour = hopscotch.getCurrTour();
  const step = hopscotch.getCurrStepNum();

  getCurrentElement().then(() => {
    hopscotch.endTour();
    hopscotch.startTour(currentTour, step);
  });
});
hopscotch.registerHelper('enable', () => getCurrentElement().then(highlight));
hopscotch.registerHelper('endTour', endTour);

function clearHistory() {
  for (let i = 0; i < history.length; i += 1)
    resetHighlight(history.pop());
}

function endTour() {
  clearHistory();

  window.removeEventListener('resize', resizeHandler);
  document.getElementById(maskId).setAttribute('class', '');
  document.getElementById(highlightId).setAttribute('class', '');

  hopscotch.endTour(false);
}

function getCurrentElement() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(tourConfig.steps[hopscotch.getCurrStepNum()].target);
      if (element) {
        clearTimeout(interval);
        resolve(element);
      }
    }, 10);
  });
}

function highlight(target) {
  clearHistory();

  const targetRect = target.getBoundingClientRect();
  const highlight = document.getElementById(highlightId);

  highlight.setAttribute('class', activeClass);

  if (!highlight.hasAttribute('style'))
    highlight.setAttribute('style', {});

  highlight.style.left = targetRect.left + 'px';
  highlight.style.top = targetRect.top + 'px';
  highlight.style.height = targetRect.height + 'px';
  highlight.style.width = targetRect.width + 'px';

  history.push(target);

  target.setAttribute('data-tour', JSON.stringify({
    'z-index': target.style['z-index'],
    'position': target.style['z-index']
  }));

  target.style['z-index'] = 999999;
  target.style['position'] = 'relative';
}

function resetHighlight(element) {
  const attr = element.hasAttribute('data-tour')
    ? JSON.parse(element.getAttribute('data-tour'))
    : {};

  if (!element.hasAttribute('style'))
    element.setAttribute('style', {});

  element.style['z-index'] = attr['z-index'];
  element.style['position'] = attr['position'];

  if (element.hasAttribute('data-tour'))
    element.removeAttribute('data-tour');

  document
    .getElementById(highlightId)
    .setAttribute('class', '');
}

function resizeHandler() {
  history.forEach(obj => highlight(obj));
}

function startTour(force) {
  if (!hopscotch.getState() || force) {
    window.addEventListener('resize', resizeHandler);
    document.getElementById(maskId).setAttribute('class', activeClass);
    setImmediate(() => hopscotch.startTour(tourConfig, 0));
  }
}

module.exports = {
  startTour
};
