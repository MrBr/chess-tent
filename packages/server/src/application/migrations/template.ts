const { getDb } = require('../client');

export const up = async function (next: () => {}) {
  const db = await getDb();
  next();
};

export const down = async function (next: () => {}) {
  const db = await getDb();
  next();
};
