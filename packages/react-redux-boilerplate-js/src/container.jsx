import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

class Container extends React.Component {
  render() {
    const { store, history,routes } = this.props;
    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>  
    );
  }
}

export default Container;

