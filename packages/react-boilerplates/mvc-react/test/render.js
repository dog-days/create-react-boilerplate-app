import React from 'react';
import { render } from 'react-dom';
import Container from 'test/app.jsx';

//监控model全局对象
window.spyModelObj = { sagas: {}, reducers: {} };

export default function renderApp() {
  const rootDOM = document.getElementById('root');
  //先移除
  render(<span />, rootDOM);
  //后渲染
  render(<Container />, rootDOM);
}
