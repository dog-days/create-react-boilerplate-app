import React from 'react';
import { connect } from 'react-redux';
//≤Locale--begin
import Locale from 'react-redux-boilerplate-js/libs/decorator/Locale';
//≤Locale--end
import PageTitle from 'react-redux-boilerplate-js/libs/decorator/PageTitle';

//connect to redux store,refer to redux.
@connect(state => {
  return {};
})
//设置页面标题
@PageTitle('主页')
//≤Locale--begin
//多语言修饰器,这跟一级路由layout view compoent是不一样的。
//这个修饰器给当前组件提供了`this.t(xxx)`方法。
//如果要保证i18n功能生效必须使用`this.t`传递字符串。
//你可以使用`npm run view-locale-to-excel`生成默认的excel语言列表.
//你可以使用`npm run excel-to-locale-config`生成不同的语言的javascirpt数组列表文件（需要读取翻译后的excel）。
@Locale
//≤Locale--end
//二级路由view组件
//你可以编辑`./_route.js`文件改变当前页面组件的url链接。
class IndexView extends React.Component {
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
