import React from 'react';
import PageTitle from 'react-mobx-boilerplate-js/libs/decorator/PageTitle';
//≤BreadCrumb--begin
import BreadCrumb from 'react-mobx-boilerplate-js/libs/decorator/BreadCrumb';
//≤BreadCrumb--end
//≤Locale--begin
import Locale from 'react-mobx-boilerplate-js/libs/decorator/Locale';
//≤Locale--end

//≤Locale--begin
//多语言修饰器,这跟一级路由layout view compoent是不一样的。
//这个修饰器给当前组件提供了`this.t(xxx)`方法。
//如果要保证i18n功能生效必须使用`this.t`传递字符串。
//你可以使用`npm run view-locale-to-excel`生成默认的excel语言列表.
//你可以使用`npm run excel-to-locale-config`生成不同的语言的javascirpt数组列表文件（需要读取翻译后的excel）。
@Locale
//≤Locale--end
//≤BreadCrumb--begin
//`@BreadCrumb` 必须在mobx `@inject`之前,这跟layout view是不一样的。
//在数组中，你可以自定义字段，也可以使用函数。
//然后你可以通过layout view 的`this.getBreadCrumbs()`获取到你设置的面包屑数组。
//`@BreadCrumb.create`必须在二级路由view组件中使用，而且还要配合layout view的`@BreadCrumb`一起使用。
//字段使用由你决定。
@BreadCrumb.create([
  {
    label: '${pageNameFirstLetter}',
    //the field depends on you.
    link: '/${pageName}',
  },
])
//≤BreadCrumb--end
//设置页面标题
@PageTitle('${pageNameFirstLetter}')
//二级路由view组件
//你可以编辑`./_route.js`文件改变当前页面组件的url链接。
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
