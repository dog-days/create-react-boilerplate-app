import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { observable, action, useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Router } from 'react-router';
import './polyfill';
useStrict(true);

/**
 * @param { object } routes 请参考react-router@3.x.x的配置模式，必填
 * @param { object } stores mobx stores
 * @param { array } defaultLocale 默认的语言列表，可空
 * @param { object } domContainer dom节点对象，默认值是document.getElementById('root')
 */
function app(routes, stores, defaultLocale, domContainer) {
  if (defaultLocale) {
    class LocaleStore {
      defaultLocale = defaultLocale;
      @observable changedLocale;
      @observable canRender = false;
      @action setChangedLocage(locale){
        this.changedLocale = locale;
      }
      @action setCanRender(flag){
        this.canRender = flag;
      }
      /**
       * 语言切换，要设置好locale目录
       * @param { string } localePath 国际化文件夹路径，相对于src目录（例如locale传进去就相当于src/locale）
       * @param { string } language 语言，按照文件命名来处理如zh_CN（.js）、en_US（.js）,.js可选
       * @param { function } beforCallback 语言切换前回调函数，可以用于展示加载状态
       * @param { function } afterCallback 语言切换成功回调函数，可以用于关闭展示加载状态
       */
      @action changeLanguage(localePath,language, beforCallback, afterCallback) {
        beforCallback && beforCallback();
        //语言切换后，使用localStorage记住，网页重新载入时选择记住的语言
        localStorage.currentLanguage = language;
        var path = localePath + '/' + language;
        import(`src/${path}`).then(locale => {
          this.setChangedLocage(locale.default);
          this.setCanRender(true);
          afterCallback && afterCallback();
        });
      }
    }
    stores.locale = new LocaleStore();
  }
  function renderApp() {
    const target = domContainer || document.getElementById('root');
    if (target) {
      render(
        <Provider {...stores}>
          <Router history={browserHistory} routes={routes} />
        </Provider>,
        target
      );
    }
  }

  return renderApp;
}

export default app;
