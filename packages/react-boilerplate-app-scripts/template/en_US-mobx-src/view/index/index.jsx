import React from 'react';
import PageTitle from 'react-mobx-boilerplate-js/libs/decorator/PageTitle';
//≤Locale--begin
import Locale from 'react-mobx-boilerplate-js/libs/decorator/Locale';
//≤Locale--end

//≤Locale--begin
//Muti-language decorator,it's different from the first route layout view component.
//It provides `this.t(xxx)` to the component.
//if you want the i18n function worked,you must use `this.t` to pass the string.
//You can use `npm run view-locale-to-excel` to generate the default language string list of excel.
//You can use `npm run excel-to-locale-config` to generate the default language javascirpts array list.
@Locale
//≤Locale--end
//set page title
@PageTitle('Home')
//the view is the second route page veiw component.
//you can eidit `./_route.js` file to change the url path for the current page.
class IndexView extends React.Component {
  t(str){
    return str;
  }
  render() {
    return (
      <div>
        <h1>{this.t('Home')}</h1>
        {this.t('To get started, edit src/view/index/index.jsx.')}
        <br />
        {this.t(
          'When you save the file,it will be updated to the browser automatically.'
        )}
      </div>
    );
  }
}

export default IndexView;
