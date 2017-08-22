//如果看不明白就需要看redux-saga-model和redux-saga教程了。
export default {
  namespace: 'about',
  state: false,
  reducers: {
    toggle: function(state, { payload }) {
      return payload;
    },
  },
  sagas: {
    *toggleShow({ payload }, effects) {
      yield effects.put({
        type: 'toggle',
        payload,
      });
    },
  },
};
