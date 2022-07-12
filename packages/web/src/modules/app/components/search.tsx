import React, {
  ComponentType,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { hooks, services, components } from '@application';
import { Components, Searchable, SearchContext, SearchOption } from '@types';

import { searchables } from '../service/search';
import { Select } from '../../ui/Select';

const { useParams } = hooks;

const defaultValue: SearchContext = {
  searchables,
  search: undefined,
  getSearchable: option =>
    searchables.find(searchable =>
      searchable.isSearchableOption(option),
    ) as Searchable,
  async getOptions(searchTerm: string): Promise<SearchOption[]> {
    const searchOptionsGrouped = await Promise.all(
      searchables.map(({ getOptions }) => getOptions(searchTerm)),
    );
    return searchOptionsGrouped.flat();
  },
};

const SearchContextInstance = React.createContext<SearchContext>(defaultValue);

const SearchProvider: ComponentType = ({ children }) => {
  const { search } = useParams<{ search: SearchContext['search'] }>();
  const [value, setState] = useState<SearchContext>({
    ...defaultValue,
    search,
  });

  useEffect(() => {
    if (search !== value.search) {
      setState(prevState => ({ ...prevState, search }));
    }
  }, [search, value.search]);

  return (
    <SearchContextInstance.Provider value={value}>
      {children}
    </SearchContextInstance.Provider>
  );
};

const Search: Components['Search'] = ({ className }) => {
  const [options, setOptions] = useState<SearchOption[]>();
  const { getSearchable, getOptions } = useContext(SearchContextInstance);

  const handleChange = useCallback(
    searchTerm => {
      if (!searchTerm) {
        setOptions([]);
      } else {
        getOptions(searchTerm).then(searchOptions =>
          setOptions(searchOptions.length > 0 ? searchOptions : []),
        );
      }
      return searchTerm;
    },
    [getOptions],
  );

  const handleOptionChange = useCallback(
    (option: SearchOption | null) => {
      if (!option) {
        // todo handle clear
        return null;
      }
      const searchable = getSearchable(option);
      searchable.onChange(option);
    },
    [getSearchable],
  );

  const formatOptionLabel = useCallback(
    option => getSearchable(option).formatOptionLabel(option),
    [getSearchable],
  );

  return (
    <Select
      isMulti={false}
      onChange={handleOptionChange}
      options={options}
      onInputChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      filterOption={() => true}
      icon="search"
      placeholder="Search anything"
      className={className}
      isSearchable
      hideDropdownIndicator
      hideMenu={!options}
    />
  );
};

components.Search = Search;
services.addProvider(SearchProvider);
