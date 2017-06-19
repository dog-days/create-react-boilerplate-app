import React from 'react';
import PageTitle from 'react-mobx-boilerplate-js/libs/decorator/PageTitle';
//≤BreadCrumb--begin
import BreadCrumb from 'react-mobx-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end
//≤Locale--begin
import LocaleDecorator from 'react-mobx-boilerplate-js/libs/decorator/Locale';
//≤Locale--end

//≤Locale--begin
//Muti-language decorator,it's different from the first route layout view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@LocaleDecorator()
//≤Locale--end
//≤BreadCrumb--begin
//BreadCrumb must be placed before redux @connect,it's different from layout view
//In the array,you can custom the fields. you can also use function.
//You can get the list of breadcrumb in layout view by using 'this.getBreadCrumbs()'.
//BreadCrumb.create must be used in second route page view component or it works nothing.
//the field depends on you.
@BreadCrumb.create([
  {
    label: '${pageNameFirstLetter}',
    //the field depends on you.
    link: '/${pageName}',
  },
])
//≤BreadCrumb--end
//set page title
@PageTitle('${pageNameFirstLetter}')
//The view is the second route page veiw component.
//You can eidit `./_route.js` file to change the url path for the current page.
class ${pageNameFirstLetter}View extends React.Component {
  render() {
    return (
      <div>
        <h1>{ this.t('${pageNameFirstLetter}') }</h1>
        { this.t('To get started, edit src/view/${pageName}/index.jsx.') }
        <br />
        {this.t(
          'When you save the file,it will be updated to the browser automatically.'
        )}
      </div>
    );
  }
}

export default ${pageNameFirstLetter}View;
