import React from 'react';
import { ui, utils } from '@application';
import { FideTitles } from '@chess-tent/models';

const { Select } = ui;
const { stringToSelectValue } = utils;

interface SelectFideTitleProps {
  fideTitle: FideTitles | undefined;
  onChange: (languages?: FideTitles) => void;
}

const SelectFideTitle = ({ fideTitle, onChange }: SelectFideTitleProps) => {
  return (
    <Select
      defaultValue={fideTitle ? stringToSelectValue(fideTitle) : null}
      options={Object.values(FideTitles).map(stringToSelectValue)}
      onChange={value => onChange(value?.value as FideTitles)}
      isMulti={false}
      menuPortalTarget={document.body}
      styles={{ menuPortal: base => ({ ...base, zIndex: 10000 }) }}
    />
  );
};

export default SelectFideTitle;
