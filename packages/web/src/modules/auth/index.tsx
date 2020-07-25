import application from '@application';
import { Authorized } from './components/authorized';
import { getToken, setToken } from './services';

application.components.Authorized = Authorized;
application.services.saveToken = setToken;
application.services.getToken = getToken;
