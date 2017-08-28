import React from 'react';
import { connect } from 'react-redux';

@connect(state => {
  return {
    display: state.about
  };
})
export default class AboutView extends React.Component {
  showToggleEvent = e => {
    const { dispatch, display } = this.props;
    if (display) {
      dispatch({
        type: 'about/toggleShow',
        payload: false
      });
    } else {
      dispatch({
        type: 'about/toggleShow',
        payload: true
      });
    }
  };
  render() {
    console.log('关于页面')
    const { display } = this.props;
    return (
      <div>
        当前位置关于页面：
        <button onClick={this.showToggleEvent}>
          {display && '隐藏'}
          {!display && '显示'}
        </button>
        {display && <div>我被显示了</div>}
      </div>
    );
  }
}
