import * as React from 'react';
import { render } from 'react-dom';
import Container from './container';

function renderApp() {
  render(<Container />, document.getElementById('root'));
}
renderApp();
