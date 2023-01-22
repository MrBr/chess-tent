import application, { services, hooks, hof } from '@application';
import { Api, createRequest } from './services';
import { useApi, useApiStatus } from './hooks';
import { withRequestHandler } from './hof';

services.api = new Api(process.env.REACT_APP_API_URL as string);
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
