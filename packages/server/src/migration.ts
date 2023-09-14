import './bootstrap';

require('./modules');
const application = require('./application').default;

if (process.argv.length < 3) {
  console.error('Expected migration direction');
  process.exit(1);
}

const [, , direction, migrationName] = process.argv;
require('migrate/lib/register-compiler')(
  'ts:./src/application/migrations/compiler.js',
);

application.init().then(async () => {
  await application.db.migrate(direction, migrationName);
  process.exit(0);
});
