import React from 'react';
import { Link } from 'react-router-dom';

import logo from 'src/style/img/logo.svg';
import 'src/style/css/bootstrap.css';
import 'src/style/css/layout-main.css';

class MainLayout extends React.Component {
  render() {
    const { children, breadcrumbs, i18n: { t, switchLanguage } } = this.props;
    return (
      <div className="layout-container">
        <nav className="navbar navbar-inverse ">
          <div className="navbar-header">
            <ul className="nav navbar-nav">
              <li className="logo-con">
                <a>
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
              </li>
              <li>
                <Link to="/main/index">
                  {t('主页')}
                </Link>
              </li>
              <li>
                <Link to="/main/about/id/1003">
                  {t('关于')}
                </Link>
              </li>
              <li
                onClick={e => {
                  switchLanguage('zh_CN');
                }}
                className="language"
              >
                <a>中文</a>
              </li>
              <li
                onClick={e => {
                  switchLanguage('en_US');
                }}
                className="language"
              >
                <a>英文</a>
              </li>
            </ul>
          </div>
        </nav>
        {breadcrumbs &&
          <ol className="breadcrumb">
            {breadcrumbs.map((v, k) => {
              return (
                <li key={k}>
                  {v.link &&
                    <Link to={v.link}>
                      {v.label}
                    </Link>}
                </li>
              );
            })}
          </ol>}
        <div className="main-contents">
          {children}
        </div>
      </div>
    );
  }
}

export default MainLayout;
