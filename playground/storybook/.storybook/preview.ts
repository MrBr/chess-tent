import '@chess-tent/web/src/modules/ui/style';
import '@chess-tent/web/src/modules';
import application from '@chess-tent/web/src/application';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// preview.js
export const loaders = [
  async () => {
    await application.init();
    return { application };
  },
];
