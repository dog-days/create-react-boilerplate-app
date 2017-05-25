import React from 'react';
import { connect } from 'react-redux';
//Link is rewrited from react-router
//if you use prefixUrl,you should use this rewrited Link component.
//or you should add preixUrl in react-router component Link.
//you can alse you `r2-js/libs/path`,`r2-js/libs/components/Link` is base on path.
//<Link to={ path('/about') } />
import Link from 'react-redux-boilerplate-js/libs/components/Link';
//≤Locale--begin
import { localeLayout } from 'react-redux-boilerplate-js/libs/decorator/Locale';
//≤Locale--end
//≤BreadCrumb--begin
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end

import logo from 'src/style/img/logo.svg';
import 'src/style/css/bootstrap.css';
import 'src/style/css/layout-main.css';

//连接redux store，请参考redux.
//这个修饰器返回的不是当前的组件，而是新的组件，所以在这个修饰器上面的修饰器传递的方法，
//在当前组件都无法使用。
//需要留意！
//≤Locale--begin
//配合修饰器`@localeLayout`使用
//传递切换后的语言列表
//如果使用这个`i18n`功能，这个是必须传递的。
//初始化的时候，state.locale.changedLocale为undifined。
//配合修饰器`@localeLayout`使用
//传递默认语言列表
//state.locale.defaultLocale初始化值是通过`react-redux-boilerplate-js/libs/index.jsx`提供的接口传递的。
//≤Locale--end
//≤BreadCrumb--begin
//这个修饰器提供了`this.getBreadCrumbs()`方法。
//`this.getBreadCrumbs()`返回面包屑数组列表。
//在Layout View中`@BreadCrumb`必须在`@connect`后面。
//≤BreadCrumb--end
//≤Locale--begin
//多语言修饰器,这跟二级路由view compoent是不一样的。
//这个修饰器给当前组件提供了`this.t(xxx)`方法。
//如果要保证i18n功能生效必须使用`this.t`传递字符串。
//这个修饰器给当前组件提供了`this.changeLanguage(xx)`方法，切换语言使用。
//你可以使用`npm run view-locale-to-excel`生成默认的excel语言列表.
//你可以使用`npm run excel-to-locale-config`生成不同的语言的javascirpt数组列表文件（需要读取翻译后的excel）。
//≤Locale--end
//layout view is the first route component.
//you can eidit `./_route.js` file to change index page and index page url path.
@connect(state => {
  return {
    changedLocale: state.locale.changedLocale,
    defaultLocale: state.locale.defaultLocale,
  };
})
@BreadCrumb
@localeLayout()
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
        {//≤BreadCrumb--begin
        breadcrumbs &&
          <ol className="breadcrumb">
            {breadcrumbs.map((v, k) => {
              return (
                <li key={k}>
                  {v.link &&
                    <Link to={v.link}>
                      {this.t(v.label)}
                    </Link>}
                  {!v.link && this.t(v.label)}
                </li>
              );
            })}
          </ol>
        //≤BreadCrumb--end
        }
        <div className="main-contents">
          {//使用cloneElement传递props到子组件.
          React.cloneElement(this.props.children, {
            //≤BreadCrumb--begin
            //如果使用了i18n功能，必须确保changedLocale和defaultLocale从Layout父组件中传递下来。
            //当然可以通过redux connect传递defaultLocale和changedLocale。
            //但不推荐。
            defaultLocale: this.props.defaultLocale,
            changedLocale: this.props.changedLocale,
            //≤BreadCrumb--end
          })}
        </div>
      </div>
    );
  }
}

export default LayoutView;
