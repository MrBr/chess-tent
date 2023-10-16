import { MongoClient, Db } from 'mongodb';
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

let client: MongoClient;
export const getDb = async () => {
  if (!client) {
    client = new MongoClient(process.env.DB_URL as string);
    await client.connect();
  }

  return [client.db(process.env.DB_NAME) as Db, client] as const;
};

// process.on('beforeExit', async () => await client.close());
