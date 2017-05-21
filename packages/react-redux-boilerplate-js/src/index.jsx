import React from 'react'
import { render } from 'react-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
import './polyfill'
import configureStore from './store'
import Container from './container'

function app(routes,reducers,defaultLocale,domContainer){
  if(defaultLocale){
    //多语言切换reducer
    function localeReducer(state,action){
      if(!state){
        state = {
          defaultLocale
        };
      }
      switch(action.type){
        case '@@locale/CHANGE':
          return Object.assign({},state,{
            changedLocale: action.locale,
          });
        break;
        default:
          return state;
      }
    }
    //reducers整合
    reducers = Object.assign({},{
      locale: localeReducer,
    },reducers);
  }
  const store = configureStore({},browserHistory,reducers);
  var history = syncHistoryWithStore(browserHistory, store,{
    selectLocationState (state) {
      if(process.env.useImmutable){
        return state.get('routing').toJS();
      }else{
        return state.routing;
      }
    }
  });
  function renderApp() {
    const target = domContainer || document.getElementById('root');
    if (target) {
      render(
        <Container store={store} history={history} routes={routes}/>,
        target
      );
    }
  }

  return renderApp;
}

export default app;
