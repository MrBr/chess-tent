import _ from 'lodash';
import React, { useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { UI } from '@types';
import Icon from './Icon';
import { Input } from './Form';

const SearchBox: UI['SearchBox'] = styled(
  ({ className, onSearch, debounce }) => {
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
      <div className={className}>
        <Input
          placeholder="Search"
          onKeyPress={handleEnter}
          onChange={handleChange}
        />
        <Icon type="search" />
      </div>
    );
  },
)({
  display: 'flex',
  maxWidth: '240px',
  justifyContent: 'space-between',
  overflow: 'hidden',
  padding: '0.5rem',
  background: '#F3F4F5',
  borderRadius: '10px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  lineHeight: 1.21,
  fontSize: '1.444em',
  input: {
    flex: 1,
    maxWidth: '200px',
    '&:focus': {
      border: 0,
      boxShadow: 'none',
      background: 'inherit',
    },
  },
  span: {
    margin: '0.3rem 0.8rem 0 0',
  },
});

export default SearchBox;
