import { services, hooks } from '@application';
import { Api, createRequest } from './services';
import { useApi } from './hooks';

export const API_PATH = `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_API_BASE_PATH}`;

services.api = new Api(API_PATH);
services.createRequest = createRequest;
hooks.useApi = useApi;
