import * as migrate from 'migrate';
import type { MigrationSet } from 'migrate';

const { MongoStateStore } = require('@nodepit/migrate-state-store-mongodb');

function initMigrations(): Promise<MigrationSet> {
  return new Promise((resolve, reject) => {
    migrate.load(
      {
        migrationsDirectory: './src/application/migrations/migrations',
        stateStore: new MongoStateStore(
          `${process.env.DB_URL}/${process.env.DB_NAME}`,
        ),
      },
      function (err, set) {
        if (err) {
          reject(err);
          return;
        }
        resolve(set);
      },
    );
  });
}

export async function runMigrations(
  direction: 'up' | 'down',
  migrationName?: string,
) {
  const migrationSet = await initMigrations();
  return new Promise<void>((resolve, reject) => {
    const migrationCb = function (err: Error | null) {
      if (err) {
        reject(err);
        return;
      }
      console.log('migrations successfully ran');
      resolve();
    };

    if (migrationName) {
      migrationSet[direction](migrationName, migrationCb);
    } else {
      migrationSet[direction](migrationCb);
    }
  });
}
