// 沙盒模式
export default function createStore(reducer) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  let currentState; // 简化，不接收传入初始值，必须由reducer默认值初始化
  let isDispatching = false;

  const currentListeners = [];

  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing.'
      );
    }
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing.'
      );
    }

    let isSubscribed = true;

    currentListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      if (isDispatching) {
        throw new Error(
          'You may not call store.getState() while the reducer is executing.'
        );
      }
      isSubscribed = false;

      const index = currentListeners.findIndex(item => item === listener);
      currentListeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    // 同步更新store
    if (typeof action !== 'object') {
      throw new Error('Actions must be plain objects.');
    }
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property.');
    }
    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = currentListeners.splice();

    listeners.forEach(listener => listener());

    // return action;
  }

  return { getState, subscribe, dispatch };
}
