import { is } from 'immutable';

function shouldComponentUpdate(other_ignore_props = []) {
  return function(nextProps = {}, nextState = {}) {
    //console.debug(this.props,nextProps)
    if (!nextState) {
      nextState = {};
    }
    const thisProps = this.props || {}, thisState = this.state || {};

    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }

    var redux_ignore_props = [
      'location',
      'params',
      'routeParams',
      'router',
      'routes',
      'dispatch',
    ];
    var ignore_props = Object.assign(
      [],
      redux_ignore_props,
      other_ignore_props
    );
    //console.debug(ignore_props)
    for (const key in nextProps) {
      //排除redux的一些影响
      if (ignore_props.indexOf(key) === -1) {
        if (
          thisProps[key] !== nextProps[key] ||
          !is(thisProps[key], nextProps[key])
        ) {
          return true;
        }
      }
    }

    for (const key in nextState) {
      if (
        thisState[key] !== nextState[key] ||
        !is(thisState[key], nextState[key])
      ) {
        return true;
      }
    }
    return false;
  };
}
/* eslint-disable no-param-reassign */
function pureRenderDecorator(ignore) {
  return function(component) {
    var shouldRender = shouldComponentUpdate(ignore);
    component.prototype.shouldComponentUpdate = shouldRender;
    return component;
  };
}
export default pureRenderDecorator;
