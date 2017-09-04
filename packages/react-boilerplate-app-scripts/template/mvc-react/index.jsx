import React from 'react';
import { render } from 'react-dom';
import Container from './container';

function randomKey() {
  return Math.random().toString(36).substring(7).split('').join('.');
}

function renderApp(hot) {
  render(<Container hot={hot} />, document.getElementById('root'));
}
renderApp();
if (module.hot) {
  module.hot.accept('./container', () => {
    var hot = randomKey();
    return renderApp(hot);
  });
}
