import React from 'react';
import ReactDOM from 'react-dom';
import { components, state } from '@application';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { batchDispatchMiddleware } from 'redux-batched-actions';

const { getRootReducer } = state;
const { App } = components;

export default () => {
  state.store = createStore(
    getRootReducer(),
    applyMiddleware(batchDispatchMiddleware, logger),
  );
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
};
