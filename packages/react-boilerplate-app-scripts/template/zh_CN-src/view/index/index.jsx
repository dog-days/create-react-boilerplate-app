import React from 'react'
import { connect } from 'react-redux'
import Locale from 'react-redux-boilerplate-js/libs/decorator/Locale'
import PageTitle from 'react-redux-boilerplate-js/libs/decorator/PageTitle'

//connect to redux store,refer to redux.
@connect((state)=>{
  return {
  };
})
//set page title
@PageTitle("主页")
//muti-language decorator,it's different from the first route layout view component.
//it provides `this.t(xxx)` to the component.
//if you want the locale function worked,you must use this to pass the string.
//you can use `npm run view-locale-to-excel` to generate the default language excel lists(must use `this.t`,donot change it).
//you can use `npm run excel-to-locale-config` to generate the default language javascirpts array lists.
//refer to the api.
@Locale
//the view is the second route page veiw component.
//you can eidit `./_route.js` file to change the url path for the current page.
class IndexView extends React.Component {

  render() {
    return (
      <div>
        <h1>{ this.t('主页') }</h1>
        { this.t('开始编写, 请编辑 src/view/index/index.jsx.') }
        <br/>
        { this.t('保存文件时，将自动更新到浏览器。') }
      </div>
    )
  }
}

export default IndexView;
