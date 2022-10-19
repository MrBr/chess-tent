import application, { services, hooks, hof, constants } from '@application';
import { Api, createRequest } from './services';
import { useApi, useApiStatus } from './hooks';
import { withRequestHandler } from './hof';

const { APP_DOMAIN } = constants;

services.api = new Api(`${APP_DOMAIN}${process.env.REACT_APP_API_BASE_PATH}`);
services.createRequest = createRequest;
hooks.useApi = useApi;
hooks.useApiStatus = useApiStatus;
hof.withRequestHandler = withRequestHandler;

application.register(
  () => import('./recipes'),
  module => {
    application.records.createApiRecipe = module.createApiRecipe;
  },
);

application.register(
  () => import('./components/status'),
  module => {
    application.components.ApiStatusLabel = module.default;
  },
);

application.register(
  () => import('./components/redirect-prompt'),
  module => {
    application.components.ApiRedirectPrompt = module.default;
  },
);
