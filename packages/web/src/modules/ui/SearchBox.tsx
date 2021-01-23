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
          size="small"
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
  background: '#F3F4F5',
  borderRadius: '10px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  span: {
    margin: '0.2rem 0.8rem 0 0',
  },
});

export default SearchBox;
