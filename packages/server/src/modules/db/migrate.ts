import * as migrate from 'migrate';
import { MongoStateStore } from '@nodepit/migrate-state-store-mongodb';

export function runMigrations() {
  return new Promise<void>((resolve, reject) => {
    migrate.load(
      {
        migrationsDirectory: './src/application/migrations/migrations',
        stateStore: new MongoStateStore(
          `${process.env.DB_URL}/${process.env.DB_NAME}` as string,
        ),
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
