// A place to configure env variables before the application is initialized
import { mergeToProcessEnv, parseEnv } from '../utils';

try {
  const env = require(`raw-loader!./.env`);
  const webEnv = require(`raw-loader!@chess-tent/web/.env`);

  const parsedEnv = parseEnv(env.default);
  const parsedWebEnv = parseEnv(webEnv.default);

  mergeToProcessEnv({ ...parsedEnv, ...parsedWebEnv });
} catch (e) {
  throw new Error(`
  Missing .env file in storybook/.storybook.
  It's a place to override other packages env variables if needed.
  For start create an empty file.
  `);
}
