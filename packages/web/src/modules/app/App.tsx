import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { state, components } from '@application';

const { Router } = components;

class App extends Component {
  render() {
    return (
      <Provider store={state.store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
