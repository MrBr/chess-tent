import { middleware, service } from '@application';
import { generateApiToken, verifyToken } from './service';
import { identify, webLogin, webLogout } from './middleware';

service.verifyToken = verifyToken;
service.generateApiToken = generateApiToken;
middleware.identify = identify;
middleware.webLogin = webLogin;
middleware.webLogout = webLogout;
