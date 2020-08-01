import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { state, components } from '@application';

const { Lesson } = components;

class App extends Component {
  render() {
    return (
      <Provider store={state.store}>
        <Lesson />
      </Provider>
    );
  }
}

export default App;
