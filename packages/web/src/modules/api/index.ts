import { services, hooks } from '@application';
import { Api, createRequest } from './services';
import { useApi } from './hooks';

services.api = new Api(process.env.REACT_APP_API_PATH as string);
services.createRequest = createRequest;
hooks.useApi = useApi;
