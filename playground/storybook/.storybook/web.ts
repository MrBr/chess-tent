import {} from 'js-cookie';
import '@chess-tent/web/src/modules/ui/style';
import '@chess-tent/web/src/modules';
import application from '@chess-tent/web/src/application';

export const loaders = [
  async () => {
    await application.init();
    return { application };
  },
];
