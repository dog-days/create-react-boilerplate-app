import React from 'react'
import { connect } from 'react-redux'
//Link is rewrited from react-router
//if you use prefixUrl,you should use this rewrited Link component.
//or you should add preixUrl in react-router component Link.
//you can alse you `r2-js/libs/path`,`r2-js/libs/components/Link` is base on path.
//<Link to={ path('/about') } />
import Link from 'react-redux-boilerplate-js/libs/components/Link'
//≤Locale--begin
import { localeLayout } from 'react-redux-boilerplate-js/libs/decorator/Locale'
//≤Locale--end
//≤BreadCrumb--begin
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb'
//≤BreadCrumb--end

import logo from 'src/style/img/logo.svg'
import 'src/style/css/bootstrap.css'
import 'src/style/css/layout-main.css'

//Connect to redux store,refer to redux.
//This decorator returns not the current component, but the new component.
//So the modifier above the modifier passes the method.
//It can not be used in the current component.
//You need to pay attention!
@connect((state)=>{
  return {
//≤Locale--begin
    //Use with the decorator `@localeLayout`.
    //Pass the list of switched languages
    //If you use this `i18n` function, this must be passed.
    //At the time of initialization, state.locale.change Locale is undefined.
    changedLocale: state.locale.changedLocale,
    //Use with the decorator `@localeLayout`.
    //Pass the list of default language.
    //The initialization value of `state.locale.defaultLocale` is passed through the interface provided
    //by `react-redux-boilerplate-js/libs/index.jsx`.
    defaultLocale: state.locale.defaultLocale,
//≤Locale--end
  };
})
//≤BreadCrumb--begin
//The decorator provides `this.getBreadCrumbs()`
//`this.getBreadCrumbs()` returns the list of breadcrumb.
//In layout view `@BreadCrumb` must be placed after redux `@connect`.
@BreadCrumb
//≤BreadCrumb--end
//≤Locale--begin
//Muti-language decorator,it's different from the second route view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@localeLayout()
//≤Locale--end
//Layout view is the first route component.
//You can eidit `./_route.js` file to change index page and index page url path.
class LayoutView extends React.Component {

  render() {
//≤BreadCrumb--begin
    var breadcrumbs =  this.getBreadCrumbs();
    //add common breadcrumbs
    breadcrumbs.unshift({
      label: this.t("Home"),
      link: "/",
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
                  { this.t('Home') }
                </Link>
              </li>
              <li>
                <Link to="/about">
                  { this.t('About') }
                </Link>
              </li>
//≤BreadCrumb--begin
              <li className="language">
                <Link onClick={ this.changeLanguage("zh_CN") }>
                  中文
                </Link>
              </li>
              <li className="language">
                <Link onClick={ this.changeLanguage("en_US") }>
                  English
                </Link>
              </li>
//≤BreadCrumb--end
            </ul>
          </div>
        </nav>
        {
//≤BreadCrumb--begin
          breadcrumbs &&
          <ol className="breadcrumb">
            {
              breadcrumbs.map((v,k)=>{
                return (
                  <li key={ k }>
                    {
                      v.link &&
                      <Link to={ v.link }>
                        { this.t(v.label) }
                      </Link>
                    }
                    {
                      !v.link &&
                      this.t(v.label)
                    }
                  </li>
                )
              })
            }
          </ol>
//≤BreadCrumb--end
        }
        <div className="main-contents">
          {
            //Use cloneElement to pass some props to children.
            React.cloneElement(this.props.children,{
//≤BreadCrumb--begin
              //When using internationalization,defaultLocale and changeLanguage
              //must be passed to the children's props.
              //You also can use redux connect to pass defaultLocale and changedLocale.
              //But it's not recommended.
              defaultLocale: this.props.defaultLocale,
              changedLocale: this.props.changedLocale,
//≤BreadCrumb--end
            })
          }
        </div>
      </div>
    )
  }
}

export default LayoutView;
