# react-redux-boilerplate-js 

> 对外提供的接口是在libs文件夹，而不是src文件夹。

会在[Create React Boilerplate App](https://github.com/dog-days/create-react-boilerplate-app)的模板中使用。

## src/index.jsx

封装了react-router和redux，对外提供的接口函数如下：

```jsx
/**
 * @param { object } routes 请参考react-router@3.x.x的配置模式，必填
 * @param { array } reduers 传递给redux combineReducers，详细请参考redux@3.x.x，必填
 * @param { array } defaultLocale 默认的语言列表，可空
 * @param { object } domContainer dom节点对象，默认值是document.getElementById('root')
 */
export default app(routes,reduers,defaultLocale,domContainer){
  ...
}
```

例如：

```jsx
import r2JS from 'react-redux-boilerplate-js/libs'
//或者 import r2JS form 'react-redux-boilerplate-js'
import defaultLocale from 'src/locale/en_US';
import routes from './.routes';
import reducers from './.reducers';
var render = r2(routes,reducers,defaultLocale);
render();
```

## JSX组件（Components）

### src/components/Link

由于需要使用到prefixURL会导致链接可能不一致，所以基于react-router `<Link />`封装了新的`<Link />`。强烈建议使用这个jsx组件。

用法跟react-router的Link组件一致，内部做了些适配和转换，确保最终的链接是有效的。

```jsx
import Link from 'react-redux-boilerplate-js/libs/components/Link'
...
<Link to="/about"/>
...
```

## 修饰器（Decorator）

### src/decorator/PageTitle

这个修饰器可以用来设置页面标题

```jsx
import PageTitle from 'react-redux-boilerplate-js/libs/decorator/PageTitle'
@PageTitle('页面标题设置处')
class View {}
```

### src/decorator/Locale

i18n功能需要使用到这个修饰器。同时这个修饰器需要跟`src/index.jsx`提供的接口中`defaultLocale`一起配合使用，要不无效果。

`Locale`装饰器分两种：

#### 一级路由Layout View Locale Decorator

先看列子。

```jsx
import { localeLayout } from 'react-redux-boilerplate-js/libs/decorator/Locale'
//connect to redux store,请参考redux.
//请把这个修饰器放在最上面
//因为这个修饰器返回的不是当前的组件，返回的是新的组件。
@connect((state)=>{
  return {
    //配合修饰器localeLayout使用
    //传递切换后的语言列表
    //如果使用这个`i18n`功能，这个是必须传递的。
    //初始化的时候，state.locale.changedLocale为undifined。
    changedLocale: state.locale.changedLocale,
    //配合修饰器localeLayout使用
    //传递默认语言列表
    //state.locale.defaultLocale初始化值是通过`react-redux-boilerplate-js/libs/index.jsx`提供的
    //接口传递的。
    defaultLocale: state.locale.defaultLocale,
  };
})
//多语言修饰器,这跟二级路由view compoent是不一样的。
//这个修饰器给当前组件提供了`this.t(xxx)`方法。
//如果要保证i18n功能生效必须使用`this.t`传递字符串。
//这个修饰器给当前组件提供了`this.changeLanguage(xx)`方法，切换语言使用。
@localeLayout
class LayoutView {}
```

`@localeLayout`提供了以下接口：

- this.t

  ```js
  /**
   * locale翻译替换函数，根据当前str和配置的语言选项替换。
   * @param {string} str 需要被替换的文字
   */
  t(str){}
  ```

- this.changeLanguage

  一般都是返回点击事件。

  ```js
  /**
   * 语言切换
   * @param { string } language 语言，按照文件命名来处理如zh_CN（.js）、en_US（.js）,.js可选
   * @param { function } beforCallback 语言切换前回调函数，可以用于展示加载状态
   * @param { function } afterCallback 语言切换成功回调函数，可以用于关闭展示加载状态
   * @param { function } 返回事件回调函数。
   */
  changeLanguage(language,beforCallback,afterCallback){
    return (e){
    }
  }
  ```

> `@localeLayout`需要使用到redux store 管理语言列表，详细看上面的例子说明。

#### 二级路由View Locale Decorator

先看列子。

```js
import Locale from 'react-redux-boilerplate-js/libs/decorator/Locale'
//多语言修饰器,这跟一级路由view compoent是不一样的。
//这个修饰器给当前组件提供了`this.t(xxx)`方法。
//如果要保证i18n功能生效必须使用`this.t`传递字符串。
@Locale
class View {}
```

`@Locale`提供了以下接口：

- this.t

  ```js
  /**
   * locale翻译替换函数，根据当前str和配置的语言选项替换。
   * @param {string} str 需要被替换的文字
   */
  t(str){}
  ```

> 必须确保changedLocale和defaultLocale从Layout父组件中传递下来。
>
> ```jsx
> <div>
>   {
>     //使用cloneElement传递props到子组件.
>     React.cloneElement(this.props.children,{
>       //如果使用了i18n功能，必须确保changedLocale和defaultLocale从Layout父组件中传递下来。
>       //当然可以通过redux connect传递defaultLocale和changedLocale。
>       //但不推荐。
>       defaultLocale: this.props.defaultLocale,
>       changedLocale: this.props.changedLocale,
>     })
>   }
> </div>
> ```

### src/decorator/BreadCrumb

面包屑修饰器，layout和page view的用法也是不同的。

#### 一级路由Layout View BreadCrumb Decorator 

先看列子：

```js
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb'

//这个修饰器提供了`this.getBreadCrumbs()`方法。
//`this.getBreadCrumbs()`返回面包屑数组列表。
//在Layout View中`@BreadCrumb`必须在`@connect`后面。
@BreadCrumb
class LayoutView {}
```

`@BreadCrumb`提供了以下接口：

- this.getBreadCrumbs

  ```js
  /**
   * @return { array } 面包写数组列表。
   */
  function getBreadCrumbs(){}
  ```

#### 二级路由View BreadCrumb Decorator

先看列子：

```js
import BreadCrumb from 'react-redux-boilerplate-js/libs/decorator/BreadCrumb'

//`@BreadCrumb` 必须在redux `@connect`之前,这跟layout view是不一样的。
//在数组中，你可以自定义字段，也可以使用函数。
//然后你可以通过layout view 的`this.getBreadCrumbs()`获取到你设置的面包屑数组。
//`@BreadCrumb.create`必须在二级路由view组件中使用，而且还要配合layout view的`@BreadCrumb`一起使用。
@BreadCrumb.create([
  {
    label: '关于',
    //字段使用由你决定。
    link: '/about',
  },
])
class LayoutView {}
```










































