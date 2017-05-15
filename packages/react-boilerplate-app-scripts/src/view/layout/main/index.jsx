import React from 'react'
import { connect } from 'react-redux'
//Link is rewrited from react-router
//if you use prefixUrl,you should use this rewrited Link component.
//or you should add preixUrl in react-router component Link.
//you can alse you `r2-js/libs/path`,`r2-js/libs/components/Link` is base on path.
//<Link to={ path('/about') } />
import Link from 'r2-js/libs/components/Link'
import { localeLayout }from 'r2-js/libs/decorator/Locale'
import BreadCrumb from 'r2-js/libs/decorator/BreadCrumb'

import logo from 'src/style/img/logo.svg'
import 'src/style/css/bootstrap.css'
import 'src/style/css/layout-main.css'

//connect to redux store,refer to redux. 
@connect((state)=>{
  return {
    //use with the decorator @localeLayout
    //pass the change language lists to the current layout component.
    //if you use the locale function，it must be deliveried. 
    //it's undefined fist time.
    changedLocale: state.locale.changedLocale,
    //pass default language lists. 
    //the default language lists is fist deliveried in `src/index.jsx` to the `r2-js` module. 
    //refer to `r2-js` in `create-react-boilerplate-app/packages/r2-js`
    defaultLocale: state.locale.defaultLocale,
  };
})
//the decorator provides `this.getBreadCrumbs()` 
//`this.getBreadCrumbs()` returns breadcrumb lists.
//in layout view BreadCrumb must after redux @connect
@BreadCrumb
//muti-language decorator,it's different from the second route view component.
//it provides `this.t(xxx)` to the component.
//if you want the locale function worked,you must use this to pass the string.
//you can use `npm run view-locale-to-excel` to generate the default language excel lists.
//you can use `npm run excel-to-locale-config` to generate the default language javascirpts array lists.
//refer to the api.
@localeLayout()
//layout view is the first route component.
//you can eidit `./_route.js` file to change index page and index page url path. 
class LayoutView extends React.Component {

  render() {
    var breadcrumbs =  this.getBreadCrumbs();
    //add common breadcrumbs
    breadcrumbs.unshift({
      label: "Home",
      link: "/",
    });
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
            </ul>
          </div>
        </nav>
        {
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
        }
        <div className="main-contents">
          { 
            //When using internationalization,defaultLocale and changeLanguage
            //must be passed to the children's props.
            //Use cloneElement to pass some props to children.
            //You also can use redux connect to pass defaultLocale and changedLocale.
            //But it's not recommended.
            React.cloneElement(this.props.children,{
              defaultLocale: this.props.defaultLocale,
              changedLocale: this.props.changedLocale,
            }) 
          }
        </div>
      </div>
    )  
  }
}

export default LayoutView; 
