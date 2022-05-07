import { services, hooks, hof, constants } from '@application';
import { Api, createRequest } from './services';
import { useApi } from './hooks';
import { withRequestHandler } from './hof';

const { APP_DOMAIN } = constants;

services.api = new Api(`${APP_DOMAIN}${process.env.REACT_APP_API_BASE_PATH}`);
services.createRequest = createRequest;
hooks.useApi = useApi;
hof.withRequestHandler = withRequestHandler;
