import { v4 as uuid } from 'uuid';
import { getDb } from '../client';

const defaultTags = [
  'Opening',
  'Middlegame',
  'Endgame',
  'Attack',
  'Defense',
  'Open position',
  'Closed position',
  'Positional play',
  'Tactic',
  'Mate',
].map((text, index) => ({ text, _id: uuid() }));

export const up = async function (next: () => {}) {
  const [db, client] = await getDb();
  const result = await db
    .collection('tags')
    .findOne({ text: defaultTags[0].text });
  if (!result) {
    await db
      .collection('tags')
      .insertMany(defaultTags, { forceServerObjectId: false });
  }
  await client.close();
  next();
};

export const down = async function (next: () => {}) {
  const [db, client] = await getDb();
  await db.collection('tags').remove({});
  await client.close();
  next();
};
