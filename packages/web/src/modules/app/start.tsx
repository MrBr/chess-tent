import React from 'react';
import { createRoot } from 'react-dom/client';
import { components } from '@application';

const { App } = components;

const start = () => {
  const container = document.getElementById('app') as HTMLElement;
  const root = createRoot(container);
  root.render(<App />);
};

export default start;
