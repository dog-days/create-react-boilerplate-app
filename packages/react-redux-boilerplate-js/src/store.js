import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
  LOCATION_CHANGE,
  routerMiddleware,
  routerReducer,
} from 'react-router-redux';

export default function configureStore(
  initialState,
  browserHistory,
  rootReducer
) {
  if (process.env.useImmutable) {
    var Immutable = require('immutable');
    var combineReducers = require('redux-immutable').combineReducers;
    initialState = Immutable.fromJS({});
    var routing = function(state, action) {
      if (!state) {
        state = initialState;
      }
      if (action.type === LOCATION_CHANGE) {
        return state.merge({
          locationBeforeTransitions: action.payload,
        });
      }
      return state;
    };
  } else {
    var combineReducers = require('redux').combineReducers;
    var routing = routerReducer;
  }
  let middleware = [thunkMiddleware];
  //下面这句话，必须设置，要不push没用
  const router = routerMiddleware(browserHistory);
  if (process.env.NODE_ENV == 'development') {
    var createLogger = require('redux-logger');
    middleware.push(router, createLogger());
  } else {
    middleware.push(router);
  }
  const finalCreateStore = applyMiddleware(...middleware)(createStore);
  const reducers = Object.assign({}, rootReducer, {
    routing,
  });
  const store = finalCreateStore(combineReducers(reducers), initialState);
  return store;
}
