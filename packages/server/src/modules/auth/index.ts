import { middleware, service } from '@application';
import {
  generateApiToken,
  generateToken,
  verifyApiToken,
  verifyToken,
} from './service';
import { identify, webLogin, webLogout } from './middleware';

service.verifyApiToken = verifyApiToken;
service.verifyToken = verifyToken;
service.generateToken = generateToken;
service.generateApiToken = generateApiToken;
middleware.identify = identify;
middleware.webLogin = webLogin;
middleware.webLogout = webLogout;
