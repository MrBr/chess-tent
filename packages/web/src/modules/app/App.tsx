import React, { Component } from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { batchDispatchMiddleware } from 'redux-batched-actions';

import { appReducer } from '../state';
import { ExerciseComponent } from '../exercise';

const store = createStore(
  combineReducers(appReducer),
  applyMiddleware(batchDispatchMiddleware, logger),
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ExerciseComponent />
      </Provider>
    );
  }
}

export default App;
