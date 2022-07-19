import { utils } from '@application';

const stringToSelectValue = (value: string) => ({
  label: value,
  value: value,
});

utils.stringToSelectValue = stringToSelectValue;
