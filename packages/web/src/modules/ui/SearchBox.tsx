import React, { useCallback, useState } from 'react';
import { SearchBoxValueOption, UI } from '@types';
import { Select } from './Select';

const SearchBox: UI['SearchBox'] = ({ className, onSearch, types }) => {
  const [options, setOptions] = useState<SearchBoxValueOption[]>();

  const handleChange = useCallback(
    searchTerm => {
      if (!types) {
        setOptions([
          {
            value: searchTerm,
            label: searchTerm,
          },
        ]);
        return;
      }
      const newOptions = types.map((type, index) => ({
        ...type,
        value: index,
        label: searchTerm,
      }));
      setOptions(newOptions);
    },
    [types],
  );

  const formatOptionLabel = useCallback(
    (data, { context, selectValue, inputValue }) => (
      <span>
        {data.prefix}
        {context === 'value' ? selectValue[0].label : inputValue}
      </span>
    ),
    [],
  );

  return (
    <Select
      isMulti={false}
      onChange={onSearch}
      options={options}
      onInputChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      filterOption={() => true}
      icon="search"
      placeholder="Search anything"
      className={className}
      isSearchable
      hideDropdownIndicator
      hideMenu={!types ? true : !options}
    />
  );
};

export default SearchBox;
