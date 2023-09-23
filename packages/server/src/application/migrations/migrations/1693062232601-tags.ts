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
].map(text => ({ text }));

export const up = async function (next: () => {}) {
  const db = await getDb();
  const result = await db
    .collection('tags')
    .findOne({ text: defaultTags[0].text });
  if (!result) {
    await db.collection('tags').insertMany(defaultTags);
  }
  next();
};

export const down = async function (next: () => {}) {
  const db = await getDb();
  db.collection('tags').remove({});
  next();
};
