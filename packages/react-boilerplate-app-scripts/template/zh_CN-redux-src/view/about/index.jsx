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
//`@BreadCrumb` 必须在redux `@connect`之前,这跟layout view是不一样的。
//在数组中，你可以自定义字段，也可以使用函数。
//然后你可以通过layout view 的`this.getBreadCrumbs()`获取到你设置的面包屑数组。
//`@BreadCrumb.create`必须在二级路由view组件中使用，而且还要配合layout view的`@BreadCrumb`一起使用。
//字段使用由你决定。
@BreadCrumb.create([
  {
    label: '关于',
    link: '/about',
  },
])
//≤BreadCrumb--end
//连接redux store，请参考redux.
//这个修饰器返回的不是当前的组件，而是新的组件，所以在这个修饰器上面的修饰器传递的方法，
//在当前组件都无法使用。
//需要留意！
@connect(state => {
  return {};
})
//设置页面标题
@PageTitle('关于')
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
class AboutView extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.t('关于')}</h1>
        {this.t('开始编写, 请编辑 src/view/about/index.jsx.')}
        <br />
        {this.t('保存文件时，将自动更新到浏览器。')}
      </div>
    );
  }
}

export default AboutView;
