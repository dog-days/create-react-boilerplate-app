import React from 'react';
import logo from 'src/assets/img/logo.svg';
import 'src/assets/css/container.css';

class Container extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h2>欢迎使用React</h2>
        </div>
        <p className="app-intro">
          请编辑src/container.jsx，保存后页面会自动更新编辑后内容，无需手动刷新页面。
          <br />
          此模板是最简单的，只是用了React，没有其他依赖。
        </p>
      </div>
    );
  }
}

export default Container;
