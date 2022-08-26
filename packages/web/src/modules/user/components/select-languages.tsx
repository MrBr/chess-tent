import React from 'react';
import { ui, utils } from '@application';

const { Select } = ui;
const { stringToSelectValue, getLanguages } = utils;

interface SelectLanguagesProps {
  languages: string[] | undefined;
  onChange: (languages?: string[]) => void;
}

const SelectLanguages = ({ languages, onChange }: SelectLanguagesProps) => {
  return (
    <Select
      defaultValue={languages?.map(stringToSelectValue)}
      options={getLanguages().map(stringToSelectValue)}
      onChange={values => onChange(values?.map(({ value }) => value))}
      isMulti
    />
  );
};

export default SelectLanguages;
