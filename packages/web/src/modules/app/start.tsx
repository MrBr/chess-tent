import React from 'react';
import ReactDOM from 'react-dom';
import { components } from '@application';

const { App } = components;

export default () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
};
