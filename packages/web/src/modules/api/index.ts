import { services, hooks } from '@application';
import { Api, createRequest } from './services';
import { useApi } from './hooks';

export const APP_DOMAIN = `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}`;

services.api = new Api(`${APP_DOMAIN}${process.env.REACT_APP_API_BASE_PATH}`);
services.createRequest = createRequest;
hooks.useApi = useApi;
