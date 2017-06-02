import React from 'react';
import { connect } from 'react-redux';
//≤Locale--begin
import Locale from 'react-redux-boilerplate-js/libs/decorator/Locale';
//≤Locale--end
import PageTitle from 'react-redux-boilerplate-js/libs/decorator/PageTitle';
//≤BreadCrumb--begin
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end

//≤BreadCrumb--begin
//BreadCrumb must be placed before redux @connect,it's different from layout view
//In the array,you can custom the fields. you can also use function.
//You can get the list of breadcrumb in layout view by using 'this.getBreadCrumbs()'.
//BreadCrumb.create must be used in second route page view component or it works nothing.
//the field depends on you.
@BreadCrumb.create([
  {
    label: 'About',
    link: '/about',
  },
])
//≤BreadCrumb--end
//connect to redux store,refer to redux.
@connect(state => {
  return {};
})
//set page title
@PageTitle('About')
//≤Locale--begin
//Muti-language decorator,it's different from the first route layout view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@Locale
//≤Locale--end
//The view is the second route page veiw component.
//You can eidit `./_route.js` file to change the url path for the current page.
class AboutView extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.t('About')}</h1>
        {this.t('To get started, edit src/view/about/index.jsx.')}
        <br />
        {this.t(
          'When you save the file,it will be updated to the browser automatically.'
        )}
      </div>
    );
  }
}

export default AboutView;
