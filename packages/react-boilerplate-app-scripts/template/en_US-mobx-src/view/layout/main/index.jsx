import React from 'react';
import {
  //inject
} from 'mobx-react';

//Link is rewrited from react-router
//if you use prefixUrl,you should use this rewrited Link component.
//or you should add preixUrl in react-router component Link.
//you can alse you `r2-js/libs/path`,`r2-js/libs/components/Link` is base on path.
//<Link to={ path('/about') } />
import Link from 'react-mobx-boilerplate-js/libs/components/Link';
//≤BreadCrumb--begin
import BreadCrumb from 'react-mobx-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end
//≤Locale--begin
import LocaleDecorator from 'react-mobx-boilerplate-js/libs/decorator/Locale';
//≤Locale--end

import logo from 'src/style/img/logo.svg';
import 'src/style/css/bootstrap.css';
import 'src/style/css/layout-main.css';

//Connect to mobx store,refer to mobx.
//This decorator returns not the current component, but the new component.
//So the modifier above the modifier passes the method.
//It can not be used in the current component.
//You need to pay attention!
//put it in the top
//@inject()
//≤Locale--begin
//Muti-language decorator,it's different from the second route view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@LocaleDecorator()
//≤Locale--end
//≤BreadCrumb--begin
//The decorator provides `this.getBreadCrumbs()`
//`this.getBreadCrumbs()` returns the list of breadcrumb.
//In layout view `@BreadCrumb` must be placed after redux `@connect`.
@BreadCrumb
//≤BreadCrumb--end
//Layout view is the first route component.
//You can eidit `./_route.js` file to change index page and index page url path.
class LayoutView extends React.Component {
  render() {
//≤BreadCrumb--begin
    var breadcrumbs = this.getBreadCrumbs();
    //add common breadcrumbs
    breadcrumbs.unshift({
      label: this.t('Home'),
      link: '/',
    });
//≤BreadCrumb--end
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
                <Link to="/">
                  {this.t('Home')}
                </Link>
              </li>
              <li>
                <Link to="/about">
                  {this.t('About')}
                </Link>
              </li>
//≤BreadCrumb--begin
              <li className="language">
                <Link onClick={this.changeLanguage('zh_CN')}>
                  中文
                </Link>
              </li>
              <li className="language">
                <Link onClick={this.changeLanguage('en_US')}>
                  English
                </Link>
              </li>
//≤BreadCrumb--end
            </ul>
          </div>
        </nav>
//≤BreadCrumb--begin
        {
          breadcrumbs &&
          <ol className="breadcrumb">
            {
              breadcrumbs.map((v, k) => {
                return (
                  <li key={k}>
                    {
                      v.link &&
                      <Link to={v.link}>
                        {this.t(v.label)}
                      </Link>
                    }
                    {
                      !v.link &&
                      this.t(v.label)
                    }
                  </li>
                );
              })
            }
          </ol>
        }
//≤BreadCrumb--end
        <div className="main-contents">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default LayoutView;
