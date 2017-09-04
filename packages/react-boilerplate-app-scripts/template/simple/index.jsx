import 'react-router-controller/libs/polyfill';
import React from 'react';
import { render } from 'react-dom';
import Container from './container';

function renderApp(hot) {
  render(<Container />, document.getElementById('root'));
}
renderApp();
if (module.hot) {
  module.hot.accept('./container', () => {
    return renderApp();
  });
}
