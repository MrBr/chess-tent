// A place to configure env variables before the application is initialized
import { mergeToProcessEnv, parseEnv } from '../../utils';

const env = require(`raw-loader!@chess-tent/web/.env`);

const parsedEnv = parseEnv(env.default);
mergeToProcessEnv(parsedEnv);
