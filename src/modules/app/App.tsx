import React, { Component } from 'react';
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import logger from 'redux-logger';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { appReducer } from "./redux";

import { Exercise } from "../trainer";

const store = createStore(
  combineReducers(appReducer),
  applyMiddleware(logger)
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Exercise/>
      </Provider>
    )
  }
}

export default App;
