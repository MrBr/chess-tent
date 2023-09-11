import * as migrate from 'migrate';
import { MigrationSet } from 'migrate';

class MockFileStore {
  save(set: MigrationSet, cb: (err: Error | null) => void) {
    cb(null);
  }
  load(cb: (...args: any[]) => void) {
    cb(null, { migrations: [] });
  }
}

/**
 * Used to run migrations on test databases.
 * These migrations are temporary.
 */
export function runContainerMigrations() {
  return new Promise<void>((resolve, reject) => {
    migrate.load(
      {
        migrationsDirectory: './src/application/migrations/migrations',
        stateStore: new MockFileStore(),
      },
      function (err, set) {
        if (err) {
          reject(err);
          return;
        }
        set.up(function (err) {
          if (err) {
            reject(err);
            return;
          }
          console.log('migrations successfully ran');
          resolve();
        });
      },
    );
  });
}
