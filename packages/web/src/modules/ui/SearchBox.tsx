import _ from 'lodash';
import React, { useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { UI } from '@types';
import Icon from './Icon';
import { Input } from './Form';

const Box = styled.div({
  display: 'flex',
  flex: '1 1 240px',
  padding: '0.5rem 0.5rem',
  background: '#F3F4F5',
  borderRadius: '10px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  lineHeight: 1.21,
  fontSize: '1.444em',
});

const SearchInput = styled(Input)({
  '&:focus': {
    border: 0,
    boxShadow: 'none',
    background: 'inherit',
  },
});

const SearchBox: UI['SearchBox'] = ({ onSearch, debounce }) => {
  const debounceSearch = useRef(_.debounce(onSearch, debounce));

  const handleChange = useCallback(event => {
    debounceSearch.current(event.target.value);
  }, []);

  const handleEnter = useCallback(event => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    debounceSearch.current(event.target.value);
  }, []);

  return (
    <Box>
      <SearchInput
        placeholder="Search"
        onKeyPress={handleEnter}
        onChange={handleChange}
      />
      <Icon type="search" />
    </Box>
  );
};

export default SearchBox;
