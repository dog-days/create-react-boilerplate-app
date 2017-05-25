import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import './polyfill';
import configureStore from './store';
import Container from './container';

/**
 * @param { object } routes 请参考react-router@3.x.x的配置模式，必填
 * @param { array } reduers 传递给redux combineReducers，详细请参考redux@3.x.x，必填
 * @param { array } defaultLocale 默认的语言列表，可空
 * @param { object } domContainer dom节点对象，默认值是document.getElementById('root')
 */
function app(routes, reducers, defaultLocale, domContainer) {
  if (defaultLocale) {
    //多语言切换reducer
    function localeReducer(state, action) {
      if (!state) {
        state = {
          defaultLocale,
        };
      }
      switch (action.type) {
        case '@@locale/CHANGE':
          return Object.assign({}, state, {
            changedLocale: action.locale,
          });
          break;
        default:
          return state;
      }
    }
    //reducers整合
    reducers = Object.assign(
      {},
      {
        locale: localeReducer,
      },
      reducers
    );
  }
  const store = configureStore({}, browserHistory, reducers);
  var history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState(state) {
      if (process.env.useImmutable) {
        return state.get('routing').toJS();
      } else {
        return state.routing;
      }
    },
  });
  function renderApp() {
    const target = domContainer || document.getElementById('root');
    if (target) {
      render(
        <Container store={store} history={history} routes={routes} />,
        target
      );
    }
  }

  return renderApp;
}

export default app;
