import React from 'react';
import ReactDOM from 'react-dom';
import { components } from '@application';

const { App } = components;

const rootElement = document.getElementById('root');

export default () => {
  if (rootElement?.hasChildNodes()) {
    ReactDOM.hydrate(<App />, rootElement);
  } else {
    ReactDOM.render(<App />, rootElement);
  }
};
