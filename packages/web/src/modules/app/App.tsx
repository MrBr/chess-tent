import React, { Component } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import { state, components } from '@application';

const { getRootReducer } = state;
const { Exercise } = components;

const store = createStore(
  getRootReducer(),
  applyMiddleware(batchDispatchMiddleware, logger),
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Exercise />
      </Provider>
    );
  }
}

export default App;
