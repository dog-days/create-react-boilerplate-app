import React from 'react'
import { connect } from 'react-redux'
//Link is rewrited from react-router
//if you use prefixUrl,you should use this rewrited Link component.
//or you should add preixUrl in react-router component Link.
//you can alse you `r2-js/libs/path`,`r2-js/libs/components/Link` is base on path.
//<Link to={ path('/about') } />
import Link from 'react-redux-boilerplate-js/libs/components/Link'
//≤Locale--begin
import { localeLayout }from 'react-redux-boilerplate-js/libs/decorator/Locale'
//≤Locale--end
//≤BreadCrumb--begin
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb'
//≤BreadCrumb--end

import logo from 'src/style/img/logo.svg'
import 'src/style/css/bootstrap.css'
import 'src/style/css/layout-main.css'

//connect to redux store,refer to redux.
@connect((state)=>{
  return {
//≤BreadCrumb--begin
    //use with the decorator @localeLayout
    //pass the change language lists to the current layout component.
    //if you use the locale function，it must be deliveried.
    //it's undefined fist time.
    changedLocale: state.locale.changedLocale,
    //pass default language lists.
    //the default language lists is fist deliveried in `src/index.jsx` to the `r2-js` module.
    //refer to `r2-js` in `create-react-boilerplate-app/packages/r2-js`
    defaultLocale: state.locale.defaultLocale,
//≤BreadCrumb--end
  };
})
//≤BreadCrumb--begin
//the decorator provides `this.getBreadCrumbs()`
//`this.getBreadCrumbs()` returns breadcrumb lists.
//in layout view BreadCrumb must after redux @connect
@BreadCrumb
//≤BreadCrumb--end
//≤Locale--begin
//muti-language decorator,it's different from the second route view component.
//it provides `this.t(xxx)` to the component.
//if you want the locale function worked,you must use this to pass the string.
//you can use `npm run view-locale-to-excel` to generate the default language excel lists.
//you can use `npm run excel-to-locale-config` to generate the default language javascirpts array lists.
//refer to the api.
@localeLayout()
//≤Locale--end
//layout view is the first route component.
//you can eidit `./_route.js` file to change index page and index page url path.
class LayoutView extends React.Component {

  render() {
//≤BreadCrumb--begin
    var breadcrumbs =  this.getBreadCrumbs();
    //add common breadcrumbs
    breadcrumbs.unshift({
      label: this.t("主页"),
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
                  { this.t('主页') }
                </Link>
              </li>
              <li>
                <Link to="/about">
                  { this.t('关于') }
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
