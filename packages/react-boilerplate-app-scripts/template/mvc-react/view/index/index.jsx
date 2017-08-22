import React from 'react';
import { connect } from 'react-redux';

@connect(state => {
  return {
    display: state.index
  };
})
export default class IndexView extends React.Component {
  showToggleEvent = e => {
    const { dispatch, display } = this.props;
    if (display) {
      dispatch({
        type: 'index/toggleShow',
        payload: false
      });
    } else {
      dispatch({
        type: 'index/toggleShow',
        payload: true
      });
    }
  };
  render() {
    console.log('主页页面')
    const { display } = this.props;
    return (
      <div>
        当前位置主页：
        <button onClick={this.showToggleEvent}>
          {display && '隐藏'}
          {!display && '显示'}
        </button>
        {display && <div>我被显示了</div>}
      </div>
    );
  }
}
