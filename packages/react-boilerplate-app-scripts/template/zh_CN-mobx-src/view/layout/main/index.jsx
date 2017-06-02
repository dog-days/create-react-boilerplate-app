import React from 'react';
import {
  //inject
} from 'mobx-react';

//Link是基于react-router重写的。
//如果你使用prefixUrl,你应该使用这个重写的Link组件。
//你也可以使用`r2-js/libs/path`传递url，`r2-js/libs/components/Link`是基于path的。
//<Link to={ path('/about') } />
import Link from 'react-mobx-boilerplate-js/libs/components/Link';
//≤BreadCrumb--begin
import BreadCrumb from 'react-mobx-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end
//≤Locale--begin
import { localeLayout } from 'react-mobx-boilerplate-js/libs/decorator/Locale';
//≤Locale--end

import logo from 'src/style/img/logo.svg';
import 'src/style/css/bootstrap.css';
import 'src/style/css/layout-main.css';

//≤Locale--begin
//Muti-language decorator,it's different from the second route view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@localeLayout()
//≤Locale--end
//≤BreadCrumb--begin
//这个修饰器提供了`this.getBreadCrumbs()`方法。
//`this.getBreadCrumbs()`返回面包屑数组列表。
@BreadCrumb
//≤BreadCrumb--end
//layout view 一级路由组件.
//你可以编辑`./_route.js`文件，改变主页和主页url.
class LayoutView extends React.Component {
  render() {
//≤BreadCrumb--begin
    var breadcrumbs = this.getBreadCrumbs();
    //add common breadcrumbs
    breadcrumbs.unshift({
      label: this.t('主页'),
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
                  {this.t('主页')}
                </Link>
              </li>
              <li>
                <Link to="/about">
                  {this.t('关于')}
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
          {
            //使用cloneElement传递props到子组件.
            React.cloneElement(this.props.children, {
//≤Locale--begin
              //如果使用了i18n功能，必须确保locale从Layout父组件中传递下来。
              //当然可以通过redux connect传递defaultLocale和changedLocale。
              //但不推荐。
              locale: this.props.locale
//≤Locale--end
            })
          }
        </div>
      </div>
    );
  }
}

export default LayoutView;
