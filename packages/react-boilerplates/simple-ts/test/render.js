import React from 'react';
import { render } from 'react-dom';
import Container from 'src/container';

export default function renderApp() {
  const rootDOM = document.getElementById('root');
  //先移除
  render(<span />, rootDOM);
  //后渲染
  render(<Container />, rootDOM);
}
