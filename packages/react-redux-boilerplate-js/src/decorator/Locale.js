import { PropTypes } from 'prop-types';

//中转作用
var __r2Locale__;
/**
 * 使用redux切换语言
 *@param { array } 需要切换的语言列表
 */
function switchLanguage(switchedLocale) {
  if (!this.props.dispatch) {
    console.error('You must use redux connect for the layout component!');
    return;
  }
  this.props.dispatch({
    type: '@@locale/CHANGE',
    locale: switchedLocale,
  });
}

/**
 * locale翻译替换函数，根据当前str和配置的语言选项替换。
 * @param {string} str 需要被替换的文字
 */
function t(str) {
  if (!this.props.defaultLocale) {
    console.error('You must use defaultlocale of store for redux connect!');
    return;
  }
  if (!__r2Locale__) {
    __r2Locale__ = {};
    this.props.defaultLocale.forEach((v, k) => {
      __r2Locale__[v] = k;
    });
  }
  if (this.props.changedLocale) {
    var o = this.props.changedLocale[__r2Locale__[str]];
    if (o) {
      return o;
    }
  }
  return str;
}
/*
 * common view locale 装饰器
 */
function localeDecorator(component) {
  component.prototype.t = t;
  component.prototype.switchLanguage = switchLanguage;
  return component;
}
/*
 * laytou view locale 装饰器
 * @param { string } localePath 国际化文件夹路径，相对于src目录（例如locale传进去就相当于src/locale）
 *                              默认值为locale
 * @this changeLanguage layoutView提供的切换语言Event
 */
export function localeLayout(localePath = 'locale') {
  return component => {
    component.prototype.t = t;
    component.prototype.switchLanguage = switchLanguage;

    class ViewComponent extends component {
      static displayName = component.displayName || component.name;

      state = {};

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        //使用记住的语言列表
        if (localStorage.currentLanguage) {
          this.changeLanguage(localStorage.currentLanguage)();
        }
      }
      /**
       * 语言切换，要设置好locale目录
       * @param { string } language 语言，按照文件命名来处理如zh_CN（.js）、en_US（.js）,.js可选
       * @param { function } beforCallback 语言切换前回调函数，可以用于展示加载状态
       * @param { function } afterCallback 语言切换成功回调函数，可以用于关闭展示加载状态
       */
      changeLanguage(language, beforCallback, afterCallback) {
        return e => {
          beforCallback && beforCallback();
          //语言切换后，使用localStorage记住，网页重新载入时选择记住的语言
          localStorage.currentLanguage = language;
          import(`src/locale/${language}`).then(locale => {
            this.switchLanguage(locale.default);
            this.setState({
              canRender: true,
            });
            afterCallback && afterCallback();
          });
        };
      }

      render() {
        //等待语言列表载入后才渲染
        if (localStorage.currentLanguage && !this.state.canRender) {
          return false;
        }
        return super.render();
      }
    }
    return ViewComponent;
  };
}

export default localeDecorator;
