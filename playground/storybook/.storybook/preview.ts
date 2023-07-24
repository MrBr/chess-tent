import './env';
import { addDecorator } from '@storybook/react';

import { loaders as webLoaders } from './web';

addDecorator(story => {
  return story();
});

// preview.js
export const loaders = [...webLoaders];
