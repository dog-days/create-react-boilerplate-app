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
@PageTitle('主页')
//the view is the second route page veiw component.
//you can eidit `./_route.js` file to change the url path for the current page.
class IndexView extends React.Component {
  t(str){
    return str;
  }
  render() {
    return (
      <div>
        <h1>{this.t('主页')}</h1>
        {this.t('开始编写, 请编辑 src/view/index/index.jsx.')}
        <br />
        {this.t('保存文件时，将自动更新到浏览器。')}
      </div>
    );
  }
}

export default IndexView;
