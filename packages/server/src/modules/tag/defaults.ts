import { service } from '@application';
import { TagModel } from './model';

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
].map(text => ({ text, id: service.generateIndex() }));

TagModel.findOne({ text: defaultTags[0].text }).then(result => {
  if (result) {
    return;
  }
  TagModel.insertMany(defaultTags);
});
